import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral bg-neutral text-neutral-content py-6">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="flex items-center justify-center gap-4 text-base text-neutral-content/70">
          <Link href="/privacy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="hover:text-accent transition-colors">
            Terms of Service
          </Link>
        </div>
        <p className="mt-2 text-sm text-neutral-content/50">
          © {new Date().getFullYear()} Booey
        </p>
      </div>
    </footer>
  );
}
