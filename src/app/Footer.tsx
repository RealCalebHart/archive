import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer">
        <Link href="/contact">Contact</Link>
        <Link href="/disclaimer">Disclaimer</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-use">Terms of Use</Link>
      </nav>
      <p className="footer-copyright">
        © 2026 System Infinity, LLC. All rights reserved.
      </p>
    </footer>
  );
}
