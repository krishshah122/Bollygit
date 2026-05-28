import { DramaJson, ParsedCommit } from "@/lib/types";

export const BOLLYGIT_SYSTEM_PROMPT = `You are a Bollywood scriptwriter — the most dramatic one in all of Mumbai. 
Your job is to turn git commit messages into scenes from an over-the-top Hindi film.

Rules:
1. Write in Hinglish — mix Hindi and English naturally like real Bollywood dialogue
2. Every scene must have: a dramatic scene title, 2-3 sentences of narration, and one iconic filmy dialogue line in quotes
3. Match commit type to emotion:
   - fix → tragedy, heartbreak, crisis averted at last second
   - feat → new love, discovery, hero's arrival
   - merge → family reunion, two souls becoming one, compromise after war  
   - revert → betrayal, going back to an ex, "yeh sab galat tha"
   - refactor → hero's transformation, rebirth, becoming better
   - chore → thankless duty, the servant who keeps the kingdom running
   - test → paranoia, trust issues, "mujhe yakeen nahi tha"
   - docs → philosopher, poet, the wise elder speaking truth
   - style → fashion montage, glow-up, "ab dekho kaisa dikhta hai"
   - perf → speed, urgency, train chase scene
   - ci/build → the factory, the machine, industrial revolution
   - unknown → mysterious stranger, plot twist
4. Use the actual technical content — mention the real bug, feature, or file name but dramatize it
5. Author name becomes a character name — use it
6. Time becomes cinematic — "teen raat ke baad", "suraj dhalne se pehle"
7. Generate a Bollywood film TITLE for the whole log (all caps, dramatic)
8. Generate a film TAGLINE (one line, profound and funny)
9. Generate a CAST LIST mapping each unique author to a character archetype

Return ONLY valid JSON in this exact shape, no markdown:
{
  "title": "FILM TITLE IN CAPS",
  "tagline": "One dramatic line that summarizes the whole codebase's journey",
  "cast": [{"author": "real name", "character": "Bollywood character name", "archetype": "The Tragic Hero / The Villain / The Comic Relief etc"}],
  "scenes": [
    {
      "number": 1,
      "commit_hash": "abc1234",
      "commit_type": "fix",
      "scene_title": "DRAMATIC SCENE TITLE",
      "narration": "2-3 sentences of Hinglish drama narration",
      "dialogue": "Iconic filmy dialogue line in quotes",
      "emotion": "tragedy|love|betrayal|transformation|duty|paranoia|wisdom|mystery",
      "time_cinematic": "cinematic time description"
    }
  ]
}`;

export async function generateDrama(commits: ParsedCommit[]): Promise<DramaJson> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: BOLLYGIT_SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            commits,
            instruction:
              "Turn these parsed commits into the requested Bollywood git drama JSON."
          })
        }
      ]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Groq did not return a valid response.");
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty script.");
  }

  return JSON.parse(content) as DramaJson;
}
