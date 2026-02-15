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
          {/* Key Points Summary */}
          <div className="bg-base-200 rounded-lg p-5 mb-8">
            <p className="font-semibold text-base-content mb-3">
              Key Points at a Glance:
            </p>
            <ul>
              <li>We only collect what we need: your Google name, email, and profile picture.</li>
              <li>Your questions are sent to Anthropic&apos;s Claude AI to generate results. <strong>We do not use your data to train AI models.</strong></li>
              <li><strong>We never sell your data.</strong> Not now, not ever.</li>
              <li>We only use cookies to keep you signed in. No tracking or ads.</li>
              <li>You can ask us to delete all your data at any time.</li>
            </ul>
          </div>

          <h2>What Is Booey?</h2>
          <p>
            Booey is a free website that gives you AI-powered tools for everyday
            tasks. You pick a tool, answer a few simple questions, and get a
            helpful result. This policy explains how we handle your information
            when you use Booey.
          </p>

          <h2>Information We Collect</h2>

          <p><strong>From Google Sign-In:</strong></p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your profile picture</li>
          </ul>
          <p>
            That&apos;s all we get from Google. We don&apos;t access your contacts,
            files, calendar, or anything else in your Google account.
          </p>

          <p><strong>When You Use Booey&apos;s Tools:</strong></p>
          <ul>
            <li>The questions you answer</li>
            <li>The AI-generated results you receive</li>
            <li>Your interaction history (so you can revisit past results)</li>
          </ul>

          <p><strong>Technical Information:</strong></p>
          <ul>
            <li>Your browser type and device</li>
            <li>Your IP address</li>
            <li>Authentication cookies (to keep you signed in)</li>
          </ul>

          <p><strong>Rate Limiting:</strong></p>
          <p>
            We track how many times you use Booey each day. This count is stored
            temporarily and resets automatically. It helps us keep the service
            running smoothly for everyone.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li><strong>Authentication</strong> — Your name and email create and identify your account.</li>
            <li><strong>Providing the service</strong> — Your questions are sent to AI to generate results.</li>
            <li><strong>Session history</strong> — We save your past results so you can find them later.</li>
            <li><strong>Rate limiting</strong> — We count daily usage to keep the service fair for everyone.</li>
            <li><strong>Improvement</strong> — We may review anonymized usage patterns to make Booey better.</li>
          </ul>

          <h2>AI &amp; Third-Party Services</h2>
          <p>
            <strong>This is important, so we want to be upfront about it.</strong>
          </p>
          <p>
            When you use a Booey tool, your questions are sent to{" "}
            <strong>Anthropic&apos;s Claude API</strong> to generate your results.
            Anthropic is the company that makes the AI we use. You can read{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Anthropic&apos;s privacy policy here
            </a>
            .
          </p>
          <p>
            <strong>We do not use your data to train AI models.</strong> Your
            questions are used only to create your result, and that&apos;s it.
          </p>
          <p>
            Please keep in mind that AI-generated content may contain errors.
            Always review your results carefully.
          </p>

          <h2>Our Third-Party Providers</h2>
          <p>We use a small number of trusted services to run Booey:</p>
          <ul>
            <li><strong>Supabase</strong> — Handles your account sign-in and stores your data.</li>
            <li><strong>Vercel</strong> — Hosts the Booey website.</li>
            <li><strong>Upstash Redis</strong> — Manages daily usage limits (rate limiting).</li>
            <li><strong>Anthropic (Claude)</strong> — Powers the AI that generates your results.</li>
          </ul>
          <p>
            Each provider has their own privacy policy. We only share what&apos;s
            needed for them to do their job.
          </p>

          <h2>Google OAuth Disclosure</h2>
          <p>
            We use Google Sign-In only for authentication and identification.
            We access your basic profile information (name, email, and profile
            picture) and nothing else. We do not request access to your Google
            Drive, Gmail, Calendar, or any other Google services.
          </p>

          <h2>We Do Not Sell Your Data</h2>
          <p>
            <strong>We do not sell, rent, or share your personal information
            with anyone for marketing or advertising.</strong> This applies to
            all users, including California residents under the CCPA. Your data
            is yours.
          </p>

          <h2>Data Retention</h2>
          <ul>
            <li><strong>Account information</strong> — Kept until you delete your account.</li>
            <li><strong>Session history</strong> — Kept until you delete your account.</li>
            <li><strong>Rate limiting data</strong> — Resets automatically each day. Stored temporarily in Redis.</li>
          </ul>
          <p>
            When you delete your account, we remove all your personal data from
            our systems.
          </p>

          <h2>Your Privacy Rights</h2>
          <p>No matter where you live, you can:</p>
          <ul>
            <li><strong>Access</strong> your data — Ask us what we have about you.</li>
            <li><strong>Correct</strong> your data — Let us know if something is wrong.</li>
            <li><strong>Delete</strong> your data — Ask us to remove everything.</li>
            <li><strong>Download</strong> your data — Get a copy of your information.</li>
            <li><strong>Opt out</strong> — Stop using Booey at any time.</li>
          </ul>
          <p>
            If you&apos;re in the EU (GDPR) or California (CCPA), you have
            additional legal protections. We honor all of them.
          </p>

          <h2>How to Exercise Your Rights</h2>
          <p>
            Send us an email at{" "}
            <a href="mailto:henrybhobin@gmail.com" className="text-primary hover:underline">
              henrybhobin@gmail.com
            </a>
            . We&apos;ll respond within 30 days.
          </p>

          <h2>Data Security</h2>
          <p>
            We take reasonable steps to protect your information. This includes:
          </p>
          <ul>
            <li>Encrypted connections (HTTPS) for all data in transit</li>
            <li>Access controls so only authorized systems touch your data</li>
            <li>Secure authentication through Supabase</li>
          </ul>
          <p>
            That said, no method of sending data over the internet is 100%
            secure. We do our best, but we can&apos;t guarantee absolute security.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies <strong>only</strong> to keep you signed in. These are
            authentication cookies managed by Supabase.
          </p>
          <p>
            We do not use analytics cookies, advertising cookies, or any kind
            of tracking cookies. That&apos;s not what we&apos;re about.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Booey is for users aged <strong>13 and older</strong>. We do not
            knowingly collect information from children under 13. If we learn
            that a child under 13 has created an account, we will delete it
            right away.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. For small changes,
            we&apos;ll update the date at the top. For big changes that affect how
            we use your data, we&apos;ll notify you by email.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about your privacy? We&apos;re happy to help. Reach out at{" "}
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
