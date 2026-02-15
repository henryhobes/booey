export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-base-200">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          style={{ color: "#2C3E50" }}
        >
          How Booey works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="text-6xl mb-4" aria-hidden="true">🎯</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#2C5682" }}
            >
              1. Pick a tool
            </h3>
            <p style={{ color: "#2C3E50" }}>
              Choose what you want help with. From writing emails to planning meals.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="text-6xl mb-4" aria-hidden="true">💬</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#2C5682" }}
            >
              2. Answer questions
            </h3>
            <p style={{ color: "#2C3E50" }}>
              We&apos;ll ask 3-5 simple questions. No confusing tech terms, just plain English.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="text-6xl mb-4" aria-hidden="true">✨</div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#2C5682" }}
            >
              3. Get your result
            </h3>
            <p style={{ color: "#2C3E50" }}>
              Copy it, edit it, print it — use it however you like. That&apos;s it!
            </p>
          </div>
        </div>

        {/* Reassurance callout */}
        <div className="mt-12 text-center bg-white rounded-lg p-6 shadow-sm">
          <p className="text-lg" style={{ color: "#2C3E50" }}>
            <strong>You can&apos;t break anything.</strong> Try as many times as you like, no wrong answers.
          </p>
        </div>
      </div>
    </section>
  );
}
