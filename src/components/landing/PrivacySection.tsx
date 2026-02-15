interface PrivacyItem {
  emoji: string;
  emojiLabel: string;
  bold: string;
  description: string;
  isPositive: boolean;
}

const privacyItems: PrivacyItem[] = [
  {
    emoji: "❌",
    emojiLabel: "No",
    bold: "We don't sell your data.",
    description: "Period. Your conversations stay private.",
    isPositive: false,
  },
  {
    emoji: "❌",
    emojiLabel: "No",
    bold: "We don't train AI on your inputs.",
    description: "Your questions and answers are yours alone.",
    isPositive: false,
  },
  {
    emoji: "❌",
    emojiLabel: "No",
    bold: "We don't require a credit card.",
    description: "Try it for free, no strings attached.",
    isPositive: false,
  },
  {
    emoji: "✅",
    emojiLabel: "Yes",
    bold: "We do protect your privacy.",
    description: "Industry-standard encryption, secure authentication.",
    isPositive: true,
  },
];

export default function PrivacySection() {
  return (
    <section
      className="py-12 md:py-16 lg:py-24"
      style={{ backgroundColor: "#F0F7F7" }}
      aria-label="Privacy commitments"
    >
      <div className="mx-auto max-w-[700px] px-4 md:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8 md:mb-12"
          style={{ color: "#2D2D2D" }}
        >
          Your Privacy, Our Promise
        </h2>

        <ul className="space-y-4 md:space-y-6 text-left">
          {privacyItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 md:gap-4 text-lg leading-relaxed"
              style={{ color: "#2D2D2D" }}
            >
              <span
                className="flex-shrink-0 text-xl md:text-2xl"
                role="img"
                aria-label={item.emojiLabel}
              >
                {item.emoji}
              </span>
              <span>
                <strong className="font-semibold">{item.bold}</strong>{" "}
                {item.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
