import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100 py-6">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="flex items-center justify-center gap-4 text-base text-base-content/60">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
        <p className="mt-2 text-sm text-base-content/40">
          © {new Date().getFullYear()} Booey
        </p>
      </div>
    </footer>
  );
}
