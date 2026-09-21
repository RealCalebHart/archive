export type Entry = {
  id: string;
  slug: string;
  entry_number: number | null;
  title: string;
  body: string | null;
  summary: string | null;
  youtube_url: string | null;
  pdf_url: string | null;
  sources: string[] | null;
  book_ids: string[] | null;
  published_at: string | null;
  created_at: string;
  category: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  threads_url: string | null;
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string | null;
  long_description: string | null;
  takeaways: string | null;
  amazon_url: string | null;
  bookshop_url: string | null;
  custom_links: { name: string; url: string }[] | null;
  image_url: string | null;
  position: number | null;
  published_at: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  entry_id: string | null;
  syllabus_section_id: string | null;
  user_id: string;
  name: string;
  comment: string;
  hidden: boolean;
  created_at: string;
};
