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
          <h2>Agreement to Terms</h2>
          <p>
            By using Booey, you agree to these terms. If you don&apos;t agree,
            please don&apos;t use the service. It&apos;s that simple.
          </p>

          <h2>What Booey Is</h2>
          <p>
            Booey is a <strong>free</strong> website that gives you AI-powered
            tools for everyday tasks. Things like writing help, meal planning,
            budgeting, and more. You pick a tool, answer a few guided questions,
            and get a helpful result.
          </p>

          <h2>Your Account</h2>
          <ul>
            <li>You must be <strong>13 years or older</strong> to use Booey.</li>
            <li>You sign in with your Google account. One account per person.</li>
            <li>You&apos;re responsible for everything that happens under your account.</li>
            <li>Keep your Google account secure. If someone else uses Booey through your sign-in, that&apos;s on you.</li>
          </ul>

          <h2>⚠️ AI-Generated Content — Please Read This</h2>
          <p>
            Booey uses AI (Anthropic&apos;s Claude) to create your results.
            While we aim for helpful and accurate output,{" "}
            <strong>AI can make mistakes.</strong> Here&apos;s what you need to know:
          </p>
          <ul>
            <li>
              <strong>Booey is not professional advice.</strong> It is not a
              substitute for medical, legal, financial, or tax advice from a
              qualified professional.
            </li>
            <li>
              AI may produce content that is <strong>inaccurate, incomplete,
              or inappropriate.</strong>
            </li>
            <li>
              <strong>You must review and verify all results</strong> before
              acting on them.
            </li>
          </ul>

          <p><strong>Specific warnings:</strong></p>
          <ul>
            <li>
              <strong>Recipes &amp; food:</strong> Always check for allergens
              and follow food safety guidelines. AI may not know about your
              dietary needs or allergies.
            </li>
            <li>
              <strong>Financial topics:</strong> Booey is not a financial
              planner. Don&apos;t make money decisions based solely on AI results.
              Talk to a financial advisor.
            </li>
            <li>
              <strong>Legal topics:</strong> Booey is not a lawyer and does not
              provide legal counsel. For legal matters, consult an attorney.
            </li>
            <li>
              <strong>Health &amp; medical:</strong> Booey is not a doctor. For
              health concerns, see a medical professional.
            </li>
          </ul>
          <p>
            Think of Booey as a <strong>helpful starting point</strong>, not the
            final word. Always use your own judgment.
          </p>

          <h2>Content Ownership</h2>
          <ul>
            <li><strong>Your inputs are yours.</strong> The questions you answer and information you provide belong to you.</li>
            <li><strong>You can use your results</strong> for personal use.</li>
            <li>
              Keep in mind that AI-generated content may not be eligible for
              copyright protection. This is an evolving area of law.
            </li>
          </ul>

          <h2>Acceptable Use</h2>
          <p>Use Booey for helpful, legitimate purposes. Please don&apos;t:</p>
          <ul>
            <li>Use Booey for anything illegal or harmful.</li>
            <li>Try to trick, jailbreak, or manipulate the AI.</li>
            <li>Scrape, copy, or automatically collect data from Booey.</li>
            <li>Try to bypass rate limits or overload the service.</li>
            <li>Impersonate others or misrepresent AI results as human-written when disclosure is needed.</li>
          </ul>
          <p>
            We reserve the right to suspend or remove accounts that break these
            rules.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Booey is provided <strong>&quot;as is&quot;</strong> without any
            warranties. We do our best to keep things running, but:
          </p>
          <ul>
            <li>We are <strong>not responsible for any damages</strong> that come from using Booey or relying on AI-generated content.</li>
            <li>This includes direct, indirect, or accidental damages of any kind.</li>
            <li>
              Our total liability to you for any claim related to Booey is
              limited to <strong>$100</strong>.
            </li>
          </ul>
          <p>
            Use your best judgment and common sense. Booey is a free tool meant
            to help, not replace professional services.
          </p>

          <h2>Third-Party Services</h2>
          <p>Booey relies on other companies to work:</p>
          <ul>
            <li><strong>Google</strong> — For signing in to your account.</li>
            <li><strong>Supabase</strong> — For storing your account and session data.</li>
            <li><strong>Anthropic (Claude)</strong> — For powering the AI that generates results.</li>
            <li><strong>Vercel</strong> — For hosting the website.</li>
          </ul>
          <p>
            We are not responsible for how these services work or any issues they
            may cause. Each has their own terms and policies.
          </p>

          <h2>Service Changes</h2>
          <p>Booey is a free service, and things may change over time. We may:</p>
          <ul>
            <li>Add, change, or remove features.</li>
            <li>Pause or shut down the service.</li>
            <li>Suspend accounts that violate these terms.</li>
          </ul>
          <p>We&apos;ll try to give notice when possible, but can&apos;t always guarantee it.</p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. For significant changes,
            we&apos;ll give you <strong>30 days&apos; notice</strong> before they take
            effect. We&apos;ll update the date at the top of this page.
          </p>
          <p>
            Continuing to use Booey after changes means you accept the updated
            terms.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about these terms? We&apos;re real people and happy to help.
            Reach out at{" "}
            <a href="mailto:henrybhobin@gmail.com" className="text-primary hover:underline">
              henrybhobin@gmail.com
            </a>
            .
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
