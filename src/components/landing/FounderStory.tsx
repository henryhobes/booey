import Image from "next/image";

export default function FounderStory() {
  return (
    <section
      className="py-12 md:py-16 lg:py-24 bg-base-100"
      aria-labelledby="founder-heading"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Photo */}
            <div className="flex-shrink-0">
              <Image
                src="https://i.pravatar.cc/300?img=11"
                alt="Henry Hobin, Founder of Booey"
                width={300}
                height={300}
                className="rounded-2xl w-48 h-48 md:w-72 md:h-72 object-cover"
                unoptimized // Using external placeholder images
              />
            </div>

            {/* Text content */}
            <div className="text-center md:text-left">
              <h2
                id="founder-heading"
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: "#2D2D2D" }}
              >
                Built by Someone Like You
              </h2>

              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: "#2D2D2D" }}
              >
                I watched my parents struggle with confusing AI chatbots. They&apos;re
                smart people — they just didn&apos;t need another tech barrier in their
                lives. Booey makes AI feel like talking to a helpful friend, not a
                computer.
              </p>

              <p
                className="text-lg font-semibold"
                style={{ color: "#0D7377" }}
              >
                — Henry Hobin, Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
