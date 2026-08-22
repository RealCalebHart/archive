-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Adds the columns needed for individual book pages and book-linked entry sources.
-- No new tables and no RLS changes are needed: these are new columns on the
-- existing `books` and `entries` tables, which anon read access already covers.

-- The long-form write-up (recommendation, thoughts) shown on a book's own page,
-- separate from the short `description` blurb used on the library grid card.
alter table books
  add column if not exists long_description text;

-- Freeform markdown: quotes, thoughts, lessons learned, commentary.
-- Rendered on the book page under "Takeaways".
alter table books
  add column if not exists takeaways text;

-- Which books an entry cites/references. Editable the same way as the existing
-- `sources` text[] column: open the entries table in Supabase Studio and paste
-- an array of book UUIDs (copy each book's `id` from the books table), e.g.
--   {a1b2c3d4-...,e5f6g7h8-...}
-- Entries.sources (free text) is unchanged and still supports non-book citations.
alter table entries
  add column if not exists book_ids uuid[] default '{}';
