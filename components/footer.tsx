import Link from "next/link";
import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-white/10 py-8 text-sm text-muted">
      <Container className="flex flex-wrap items-center justify-between gap-3">
        <p>(c) {new Date().getFullYear()} Ren Fujita</p>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>
          <Link href="/features" className="hover:text-white">
            Features
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
