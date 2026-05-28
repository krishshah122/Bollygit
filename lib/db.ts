import { StoredDrama, DramaJson, DramaScene } from "@/lib/types";
import { getSupabase, hasSupabaseConfig } from "./supabase";

// Server-side in-memory cache for fallback when Supabase is not configured.
// Using global to persist across hot-reloads in Next.js development server.
const globalForDb = global as unknown as {
  memoryDramas?: Map<string, StoredDrama>;
  memoryUpvotes?: Set<string>;
};

if (!globalForDb.memoryDramas) {
  globalForDb.memoryDramas = new Map<string, StoredDrama>();
}
if (!globalForDb.memoryUpvotes) {
  globalForDb.memoryUpvotes = new Set<string>();
}

export const memoryDramas = globalForDb.memoryDramas;
export const memoryUpvotes = globalForDb.memoryUpvotes;

export async function insertDrama(drama: Omit<StoredDrama, "created_at" | "drama_json"> & { drama_json: any }) {
  const createdAt = new Date().toISOString();
  if (hasSupabaseConfig()) {
    const supabase = getSupabase();
    const { error } = await supabase.from("dramas").insert({
      id: drama.id,
      git_log: drama.git_log,
      drama_json: drama.drama_json,
      title: drama.title,
      tagline: drama.tagline,
      director: drama.director,
      upvotes: drama.upvotes
    });
    if (error) throw error;
  } else {
    memoryDramas.set(drama.id, {
      ...drama,
      created_at: createdAt
    });
  }
}

export async function getDramaById(id: string): Promise<StoredDrama | null> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("dramas")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as StoredDrama;
  } else {
    return memoryDramas.get(id) || null;
  }
}

export async function upvoteDrama(dramaId: string, fingerprint: string): Promise<number> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabase();
    const { error: voteError } = await supabase.from("upvotes").insert({
      drama_id: dramaId,
      fingerprint
    });

    if (voteError) {
      if (voteError.code === "23505" || voteError.message?.includes("duplicate")) {
        const { data } = await supabase
          .from("dramas")
          .select("upvotes")
          .eq("id", dramaId)
          .single();
        throw new Error("Dil ek hi baar vote karta hai.");
      }
      throw voteError;
    }

    const { data: current, error: readError } = await supabase
      .from("dramas")
      .select("upvotes")
      .eq("id", dramaId)
      .single();

    if (readError) throw readError;

    const nextVotes = (current?.upvotes || 0) + 1;
    const { error: updateError } = await supabase
      .from("dramas")
      .update({ upvotes: nextVotes })
      .eq("id", dramaId);

    if (updateError) throw updateError;
    return nextVotes;
  } else {
    const voteKey = `${dramaId}:${fingerprint}`;
    if (memoryUpvotes.has(voteKey)) {
      throw new Error("Dil ek hi baar vote karta hai.");
    }
    memoryUpvotes.add(voteKey);
    const drama = memoryDramas.get(dramaId);
    if (!drama) {
      throw new Error("Drama not found");
    }
    drama.upvotes += 1;
    return drama.upvotes;
  }
}

export async function getHallOfFameDramas(): Promise<StoredDrama[]> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("dramas")
      .select("*")
      .order("upvotes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);
    if (error) throw error;
    return (data || []) as StoredDrama[];
  } else {
    return Array.from(memoryDramas.values())
      .sort((a, b) => {
        if (b.upvotes !== a.upvotes) {
          return b.upvotes - a.upvotes;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      .slice(0, 12);
  }
}
