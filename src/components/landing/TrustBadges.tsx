interface TrustBadge {
  label: string;
}

const badges: TrustBadge[] = [
  { label: "Free to try (no credit card)" },
  { label: "No installation required" },
  { label: "Works on any device" },
];

export default function TrustBadges() {
  return (
    <div
      className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6"
      role="list"
      aria-label="Trust indicators"
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          role="listitem"
          className="flex items-center gap-2 text-base min-h-[48px] px-2"
          style={{ color: "#5A5A5A" }}
        >
          <span
            className="text-green-600 flex-shrink-0"
            role="img"
            aria-label="Checkmark"
          >
            ✓
          </span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
