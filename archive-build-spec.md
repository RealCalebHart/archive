# The Archive — build spec

This is a functional spec, not a design spec. Styling, typography, and
color direction will be provided separately — build components that
accept that styling cleanly, but don't make aesthetic decisions here.

## Project context

- Next.js app (App Router), TypeScript
- Lives at `calebhart.com/archive`, but runs as its own separate Vercel
  project from the main landing page — connected via a rewrite rule in
  the landing page's repo, not part of that repo
- `basePath` is set to `/archive` in `next.config.js` so all routes and
  assets resolve correctly under that path
- Backend: Supabase (Postgres database + file storage), no separate
  backend server. The Supabase project already exists — it's called
  `Project-Archive`, region us-east-2 (East US, Ohio). Do not create a
  new Supabase project or re-run setup for it; the tables, policies,
  and storage bucket described below already exist exactly as written.
  Connect to it using the credentials in `.env.local` (see Environment
  variables section).
- CH Studio (a separate existing app, different codebase) is the
  publishing and moderation interface — it connects directly to this
  project's Supabase instance using a service-role key on its own side.
  Nothing in this repo needs to expose an API for CH Studio to call —
  it talks to Supabase directly. This repo only needs to define the
  database schema and Row Level Security policies that make that safe.

## Data model (Supabase) — already built, do not recreate

The schema below already exists in the live `Project-Archive` Supabase
project, exactly as written. Build against it as-is — do not rename
columns, tables, or the storage bucket, and do not generate migration
SQL for any of this; it's only included here so the actual code (types,
queries, form fields) matches reality.

### `entries` table
```sql
create table entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  entry_number int,
  title text not null,
  body text,
  youtube_url text,
  pdf_url text,
  sources text[],
  published_at timestamptz,
  created_at timestamptz default now()
);
```
- `body` is markdown — render it as such on the entry page
- `sources` is a plain text array (not a related table)
- `published_at` is null for unpublished/draft entries — the homepage
  and entry pages should only ever show rows where this is not null
- `entry_number` is a plain integer set manually at publish time (e.g.
  14), not auto-generated

### `comments` table
```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references entries(id) on delete cascade,
  name text not null,
  comment text not null,
  hidden boolean default false,
  created_at timestamptz default now()
);
```
- Only show comments where `hidden = false`
- No `email` column exists — don't add one to the form

### Storage
- Bucket name: `entry-attachments` (public bucket — holds PDFs and any
  images/attachments referenced in entry bodies)

### Row Level Security — already applied, do not re-write
- `entries`: public `select` where `published_at is not null`. No
  public insert/update/delete policy exists — writes only happen via
  the service-role key (CH Studio), which bypasses RLS entirely.
- `comments`: public `insert` allowed unconditionally (anyone can
  submit a comment, no auth). Public `select` where `hidden = false`.
  No public update/delete policy — moderation happens via the
  service-role key in CH Studio.
- `storage.objects` on `entry-attachments`: public `select`. No public
  write policy — uploads happen via the service-role key.

## Pages and routes

### `/archive` — homepage
- Pulls published entries live from Supabase (no hardcoded data)
- Displays a stats row: total published entry count, total sources
  cited across all entries, and days running (computed from a fixed
  project start date)
- Displays a grid of entries (most recent first), each linking to its
  entry page

### `/archive/[slug]` — entry page
- One shared template used by every entry — nothing about this page
  should need to change per entry; all content comes from the database
  row matched by `slug`
- Renders: title, embedded YouTube video (from `youtube_url`), body
  content (rendered from markdown), list of sources
- "Download PDF" button/link in a consistent position, pointing at that
  entry's `pdf_url`. This must be the same component and placement on
  every entry — publishing a new entry with a different PDF should
  never require touching this page's code, only updating the database
  row
- Comment section:
  - List of visible comments (`hidden = false`) for this entry, oldest
    or newest first (use judgment, but be consistent)
  - Submission form: name + comment text only. No email field, no
    account requirement, no CAPTCHA or spam protection in this version
    — that's intentionally deferred to a later pass. Submitting inserts
    a row into `comments` tied to this entry's `id`.

## Explicitly out of scope for this build

- Comment spam protection (CAPTCHA, rate limiting, honeypot fields) —
  will be added in a later pass
- Any admin/moderation UI — moderation happens in CH Studio, a separate
  codebase, not in this project
- User accounts or authentication of any kind
- Search or filtering across entries
- Any styling, layout, typography, or color decisions — to be provided
  separately

## Environment variables needed

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

(These are client-side/public keys used for the read-only and
comment-insert operations the public site performs. The service-role
key used by CH Studio for publishing and moderation is a separate,
more privileged key that lives only in CH Studio's own environment —
never in this repo.)
