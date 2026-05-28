# BollyGit

Every commit message becomes a scene from a Bollywood film. Your repo finally gets the drama it always deserved.

## Stack

- Next.js 14 app router
- Tailwind CSS
- Groq API with `llama-3.3-70b-versatile`
- Supabase Postgres
- Vercel
- `html2canvas` for poster download
- `nanoid` for shareable drama URLs

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env vars:

   ```bash
   cp .env.local.example .env.local
   ```

3. Add your free keys:

   ```bash
   GROQ_API_KEY=
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Create Supabase tables by running [`supabase.sql`](./supabase.sql) in the Supabase SQL editor.

5. Start the app:

   ```bash
   npm run dev
   ```

## Free API Keys

- Groq: create a free API key at [console.groq.com](https://console.groq.com/keys).
- Supabase: create a free project at [supabase.com](https://supabase.com), then copy the Project URL and anon public key from Project Settings > API.

## Git Log Input

Preferred:

```bash
git log --pretty=format:'%h|%an|%ar|%s'
```

Windows PowerShell:

```powershell
git log --pretty=format:"%h|%an|%ar|%s"
```

Quick mode:

```bash
git log --oneline
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/bollygit&env=GROQ_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_SITE_URL)

After deployment, set `NEXT_PUBLIC_SITE_URL` to your production URL so OG image links resolve correctly.
