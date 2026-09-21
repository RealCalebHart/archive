-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Adds a short summary/quote line shown under the entry title, plus
-- per-entry social links ("view on Instagram/Facebook/etc." for that
-- specific piece of content) shown as an icon row on the entry page.
-- No new tables and no RLS changes are needed: these are new columns on
-- the existing `entries` table, which anon read access already covers.

-- Short freeform line (a pull-quote or one-sentence summary) shown under
-- the title on the entry page. Optional — the line is hidden when null.
alter table entries
  add column if not exists summary text;

-- Per-entry links to where this specific piece of content lives on other
-- platforms. Each is optional; the "view on..." icon row only shows an
-- icon for the platforms that have a URL set. `youtube_url` already
-- covers YouTube, so there's no separate youtube link column here.
alter table entries
  add column if not exists instagram_url text;
alter table entries
  add column if not exists facebook_url text;
alter table entries
  add column if not exists tiktok_url text;
alter table entries
  add column if not exists linkedin_url text;
alter table entries
  add column if not exists x_url text;
alter table entries
  add column if not exists threads_url text;
