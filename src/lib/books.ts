export type Book = {
  slug: string;
  title: string;
  author: string;
  description: string;
  amazonUrl?: string;
  bookshopUrl?: string;
};

// Digital bookshelf. Not part of the Supabase schema — edit this array
// directly to add books you recommend or that are used in the project.
export const BOOKS: Book[] = [
  {
    slug: "example-book",
    title: "Example Book — replace me",
    author: "Author Name",
    description:
      "Placeholder entry. Edit src/lib/books.ts and replace this with a real book you recommend, including a short description of why it matters.",
    amazonUrl: "https://www.amazon.com/",
    bookshopUrl: "https://bookshop.org/",
  },
];
