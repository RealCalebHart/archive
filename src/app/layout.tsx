import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import Footer from "./Footer";
import Nav from "./Nav";
import { getBooks, getEntrySearchIndex } from "@/lib/queries";
import { getSyllabusSearchIndex } from "@/lib/syllabus";
import "./globals.css";

const crimson = Crimson_Text({
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "The Archive — Caleb Hart",
  description: "The Archive — a content hub of entries, sources, and notes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [entries, syllabusSections, books] = await Promise.all([
    getEntrySearchIndex(),
    getSyllabusSearchIndex(),
    getBooks(),
  ]);

  return (
    <html lang="en" className={crimson.variable}>
      <body>
        <Nav entries={entries} syllabusSections={syllabusSections} books={books} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
