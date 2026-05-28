import { CommitType, ParsedCommit } from "@/lib/types";

const conventionalTypes: CommitType[] = [
  "fix",
  "feat",
  "merge",
  "revert",
  "refactor",
  "chore",
  "test",
  "docs",
  "style",
  "perf",
  "ci",
  "build"
];

export function parseGitLog(input: string): ParsedCommit[] {
  // Check if it's the standard multiline git log format (e.g. from plain "git log")
  if (input.includes("commit ") && input.includes("Author:")) {
    const blocks = input.split(/^commit\s+/m).map(b => b.trim()).filter(Boolean);
    const parsed: ParsedCommit[] = [];

    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      if (lines.length < 3) continue;

      const hashFull = lines[0].trim();
      // Match a valid SHA hash length
      if (!/^[a-f0-9]{7,40}$/i.test(hashFull)) continue;
      const hash = hashFull.slice(0, 7);

      let author = "Unknown Dev";
      let time = "sometime ago";
      let messageLines: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("Author:")) {
          const rawAuthor = line.substring(7).trim();
          const emailIndex = rawAuthor.indexOf("<");
          author = emailIndex !== -1 ? rawAuthor.slice(0, emailIndex).trim() : rawAuthor;
        } else if (line.startsWith("Date:")) {
          time = line.substring(5).trim();
        } else if (line.startsWith("Merge:")) {
          // Ignore merge commit metadata line
        } else {
          if (line.trim()) {
            messageLines.push(line.trim());
          }
        }
      }

      const message = messageLines.join(" ");
      if (message) {
        parsed.push({
          hash,
          author,
          time,
          message,
          type: detectCommitType(message)
        });
      }
    }

    return parsed.slice(0, 20);
  }

  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseLine)
    .filter((commit): commit is ParsedCommit => Boolean(commit))
    .slice(0, 20);
}

function parseLine(line: string): ParsedCommit | null {
  // Strip out leading git graph decorations like "* ", "| * ", "\ ", "/ ", etc.
  // keeping the commit hash (5 to 40 hex characters).
  const cleaned = line.replace(/^[\s*|\\/_o-]*([a-f0-9]{5,40})/, "$1").trim();

  if (cleaned.includes("|")) {
    const [hash, author, time, ...messageParts] = cleaned.split("|");
    const message = messageParts.join("|").trim();

    if (!hash?.trim() || !message) {
      return null;
    }

    return {
      hash: hash.trim(),
      author: author?.trim() || "Unknown Dev",
      time: time?.trim() || "sometime ago",
      message,
      type: detectCommitType(message)
    };
  }

  const oneline = cleaned.match(/^([a-f0-9]{5,40})\s+(.+)$/i);
  if (!oneline) {
    return null;
  }

  const [, hash, rawMessage] = oneline;
  // Strip out git decorators like "(HEAD -> feature/login-page, origin/main)"
  const message = rawMessage.replace(/^\([^)]+\)\s+/, "").trim();

  return {
    hash,
    author: "Unknown Dev",
    time: "recently",
    message,
    type: detectCommitType(message)
  };
}

export function detectCommitType(message: string): CommitType {
  const normalized = message.trim().toLowerCase();

  if (normalized.startsWith("merge")) {
    return "merge";
  }

  if (normalized.startsWith("revert")) {
    return "revert";
  }

  const conventional = normalized.match(/^([a-z]+)(\(.+?\))?!?:/);
  const type = conventional?.[1] as CommitType | undefined;

  if (type && conventionalTypes.includes(type)) {
    return type;
  }

  return "unknown";
}

export function inferDirector(commits: ParsedCommit[]): string {
  const author = commits.find((commit) => commit.author !== "Unknown Dev")?.author;
  return author || "git blame";
}
