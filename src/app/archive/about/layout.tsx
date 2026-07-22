import { Space_Grotesk, DM_Mono, DM_Sans } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  weight: ["700"],
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-label",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${dmSans.variable} about-page`}
    >
      {children}
    </div>
  );
}
