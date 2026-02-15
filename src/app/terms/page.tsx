import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service - Booey",
  description: "Simple, clear terms for using Booey. No legalese.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-3xl px-4 py-10 md:py-16">
        <Link href="/" className="text-primary hover:underline text-base">
          ← Back to Booey
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-2 text-base-content">
          Terms of Service
        </h1>
        <p className="text-base text-base-content/60 mb-8">
          Last updated: February 15, 2026
        </p>

        <div className="prose prose-lg max-w-none text-base-content/80 [&_h2]:text-base-content [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_li]:mb-1">
          <p>
            These are the ground rules for using Booey. We&apos;ve kept them short and
            readable because nobody likes wading through pages of legal text.
          </p>

          <h2>What Booey Is</h2>
          <p>
            Booey is a free service that provides AI-powered tools for everyday
            tasks — things like writing, planning, and organizing. You pick a
            tool, answer a few guided questions, and get a helpful result.
          </p>

          <h2>Your Account</h2>
          <p>
            You sign in with your Google account. You&apos;re responsible for keeping
            your Google account secure. If someone else uses Booey through your
            account, you&apos;re responsible for their activity too.
          </p>
          <p>
            Booey is free to use with a limit of <strong>20 interactions per day</strong>.
            This helps us keep the service running smoothly for everyone.
          </p>

          <h2>Acceptable Use</h2>
          <p>
            Use Booey for helpful, legitimate purposes. Please don&apos;t use it to:
          </p>
          <ul>
            <li>Generate harmful, abusive, or illegal content</li>
            <li>Attempt to break, overload, or exploit the service</li>
            <li>Impersonate others or misrepresent AI results as human-written when disclosure is required</li>
          </ul>
          <p>
            We reserve the right to suspend accounts that violate these guidelines.
          </p>

          <h2>Important: AI Results Are Not Professional Advice</h2>
          <p>
            Booey uses AI (specifically Anthropic&apos;s Claude) to generate results.
            While we aim for helpful, accurate output, <strong>AI can make mistakes</strong>.
          </p>
          <p>
            Booey&apos;s results are <strong>not a substitute for professional advice</strong> —
            medical, legal, financial, or otherwise. Always consult a qualified
            professional for important decisions. Think of Booey as a helpful
            starting point, not the final word.
          </p>

          <h2>Your Content</h2>
          <p>
            The answers you provide and results you receive are yours. We store
            your session history so you can access it later, but we don&apos;t claim
            ownership of your content.
          </p>

          <h2>Service Availability</h2>
          <p>
            Booey is a free service. We do our best to keep it running, but we
            can&apos;t guarantee 100% uptime. We may need to take the service down
            for maintenance, updates, or other reasons. We&apos;ll try to give notice
            when possible.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Booey is provided &quot;as is.&quot; We&apos;re not liable for any damages arising
            from your use of the service, including reliance on AI-generated
            results. Use your best judgment and common sense.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. When we do, we&apos;ll update
            the date at the top of this page. Continued use of Booey after changes
            means you accept the updated terms.
          </p>

          <h2>Questions?</h2>
          <p>
            We&apos;re real people and happy to chat. Reach out at{" "}
            <a href="mailto:hello@booey.ai" className="text-primary hover:underline">
              hello@booey.ai
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
