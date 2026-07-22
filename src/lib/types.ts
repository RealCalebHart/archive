export type Entry = {
  id: string;
  slug: string;
  entry_number: number | null;
  title: string;
  body: string | null;
  youtube_url: string | null;
  pdf_url: string | null;
  sources: string[] | null;
  published_at: string | null;
  created_at: string;
  category: string | null;
};

export type Comment = {
  id: string;
  entry_id: string;
  user_id: string;
  name: string;
  comment: string;
  hidden: boolean;
  created_at: string;
};
