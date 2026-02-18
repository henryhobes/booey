import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🤔</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Page not found
        </h1>
        <p className="text-lg text-base-content/70 mb-8">
          We couldn&apos;t find what you&apos;re looking for. It may have been
          moved or no longer exists.
        </p>
        <Link
          href="/"
          className="btn btn-secondary btn-lg text-lg min-h-[56px] px-8"
        >
          Browse Tools →
        </Link>
      </div>
    </div>
  );
}
