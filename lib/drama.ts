import { CastMember, DramaScene, StoredDrama } from "@/lib/types";

export function normalizeDrama(row: StoredDrama): StoredDrama {
  const source = row as any;

  if (Array.isArray(source.drama_json)) {
    return row;
  }

  return {
    ...row,
    drama_json: source.drama_json?.scenes || [],
    cast: source.drama_json?.cast || row.cast || []
  };
}

export function getCast(drama: StoredDrama): CastMember[] {
  return drama.cast || [];
}
