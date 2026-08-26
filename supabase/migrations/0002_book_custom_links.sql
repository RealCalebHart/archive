-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Adds a column for extra buy/reference links on a book beyond the built-in
-- Amazon and Bookshop fields (e.g. publisher site, library, indie store).
-- No new tables and no RLS changes are needed: anon read access on `books`
-- already covers this new column.

-- Array of { name: string, url: string } objects, editable from the Books
-- tab in the archive admin (same repeatable-list pattern as entries.sources).
alter table books
  add column if not exists custom_links jsonb default '[]';
