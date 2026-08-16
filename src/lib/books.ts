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
    slug: "100m-offers",
    title: "$100M Offers: How To Make Offers So Good People Feel Stupid Saying No",
    author: "Alex Hormozi",
    description: "The best book I've found on solving what to sell. A must-read.",
    amazonUrl: "https://amzn.to/3SbQJZW",
    bookshopUrl: "https://bookshop.org/a/127421/9798223100270",
  },
  {
    slug: "",
    title: "",
    author: "",
    description: "",
  },
];
