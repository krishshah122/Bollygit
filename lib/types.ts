export type CommitType =
  | "fix"
  | "feat"
  | "merge"
  | "revert"
  | "refactor"
  | "chore"
  | "test"
  | "docs"
  | "style"
  | "perf"
  | "ci"
  | "build"
  | "unknown";

export type ParsedCommit = {
  hash: string;
  author: string;
  time: string;
  message: string;
  type: CommitType;
};

export type CastMember = {
  author: string;
  character: string;
  archetype: string;
};

export type DramaScene = {
  number: number;
  commit_hash: string;
  commit_type: CommitType;
  scene_title: string;
  narration: string;
  dialogue: string;
  emotion:
    | "tragedy"
    | "love"
    | "betrayal"
    | "transformation"
    | "duty"
    | "paranoia"
    | "wisdom"
    | "mystery"
    | string;
  time_cinematic: string;
};

export type DramaJson = {
  title: string;
  tagline: string;
  cast: CastMember[];
  scenes: DramaScene[];
};

export type StoredDrama = {
  id: string;
  git_log: string;
  drama_json: DramaScene[];
  title: string;
  tagline: string;
  director: string;
  upvotes: number;
  created_at: string;
  cast?: CastMember[];
};
