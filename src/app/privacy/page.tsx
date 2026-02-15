import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - Booey",
  description: "How Booey handles your data. Simple, honest, no surprises.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-3xl px-4 py-10 md:py-16">
        <Link href="/" className="text-primary hover:underline text-base">
          ← Back to Booey
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-2 text-base-content">
          Privacy Policy
        </h1>
        <p className="text-base text-base-content/60 mb-8">
          Last updated: February 15, 2026
        </p>

        <div className="prose prose-lg max-w-none text-base-content/80 [&_h2]:text-base-content [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_li]:mb-1">
          <p>
            We built Booey to be helpful, not creepy. Here&apos;s exactly what we
            collect, why, and what we do with it. No surprises.
          </p>

          <h2>What We Collect</h2>
          <p>
            When you sign in with Google, we receive your <strong>name</strong>,{" "}
            <strong>email address</strong>, and <strong>profile picture</strong>.
            That&apos;s it — we don&apos;t dig into your Google account for anything else.
          </p>
          <p>
            When you use Booey&apos;s tools, we store your <strong>session history</strong>{" "}
            (the questions you answered and results you received) so you can find
            them later in your History tab.
          </p>

          <h2>How We Use Your Data</h2>
          <ul>
            <li><strong>Account creation</strong> — Your name and email identify your account.</li>
            <li><strong>Personalization</strong> — Your profile picture appears in the navigation bar.</li>
            <li><strong>Session history</strong> — Stored so you can revisit past results.</li>
            <li><strong>Service improvement</strong> — We may review anonymized usage patterns to make Booey better.</li>
          </ul>

          <h2>AI &amp; Your Answers</h2>
          <p>
            When you use a Booey tool, your answers are sent to the Claude AI API
            to generate your results. Your answers are not permanently stored by
            the AI — they&apos;re used to create your result, and that&apos;s it.
          </p>
          <p>
            Your session history (questions and results) is stored in our database
            so you can access it anytime from your History tab.
          </p>

          <h2>We Never Sell Your Data</h2>
          <p>
            Period. We don&apos;t sell, rent, or share your personal information with
            third parties for marketing or advertising purposes. Your data is yours.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies only for keeping you signed in (authentication cookies
            managed by Supabase). No tracking cookies. No ad cookies. No creepy
            stuff.
          </p>

          <h2>Deleting Your Data</h2>
          <p>
            Want your data removed? Just email us at{" "}
            <a href="mailto:hello@booey.ai" className="text-primary hover:underline">
              hello@booey.ai
            </a>{" "}
            and we&apos;ll take care of it. We&apos;ll delete your account and all associated
            data.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            If we make significant changes, we&apos;ll update this page and the date
            at the top. We won&apos;t sneak anything past you.
          </p>

          <h2>Questions?</h2>
          <p>
            Reach out anytime at{" "}
            <a href="mailto:hello@booey.ai" className="text-primary hover:underline">
              hello@booey.ai
            </a>
            . We&apos;re happy to help.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
