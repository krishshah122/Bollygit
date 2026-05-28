create table if not exists dramas (
  id text primary key,
  git_log text not null,
  drama_json jsonb not null,
  title text not null,
  tagline text not null,
  director text not null,
  upvotes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists upvotes (
  drama_id text not null references dramas(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now(),
  primary key (drama_id, fingerprint)
);

create index if not exists dramas_upvotes_created_at_idx
  on dramas (upvotes desc, created_at desc);

alter table dramas enable row level security;
alter table upvotes enable row level security;

create policy "Anyone can read dramas"
  on dramas for select
  using (true);

create policy "Anyone can create dramas"
  on dramas for insert
  with check (true);

create policy "Anyone can update upvote counts"
  on dramas for update
  using (true)
  with check (true);

create policy "Anyone can read upvotes"
  on upvotes for select
  using (true);

create policy "Anyone can create one upvote per fingerprint"
  on upvotes for insert
  with check (true);
