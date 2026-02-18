import { getAllUseCases } from "@/lib/use-cases";
import ExploreContent from "@/components/explore/ExploreContent";
import { Footer } from "@/components/Footer";

const FEATURED_IDS = [
  "healthy-recipe",
  "difficult-email",
  "bill-negotiation",
  "gift-ideas",
  "meal-plan-week",
];

export default function HomePage() {
  const useCases = getAllUseCases();
  const allUseCases = useCases.map(
    ({ id, title, description, icon, category_label, addedDate, popular }) => ({
      id,
      title,
      description,
      icon,
      categoryLabel: category_label,
      addedDate: addedDate ?? "2026-02-01",
      popular: popular ?? false,
    })
  );

  const featured = FEATURED_IDS.map((fid) => allUseCases.find((uc) => uc.id === fid)).filter(
    (uc): uc is NonNullable<typeof uc> => uc != null,
  );

  // Deduplicated categories in order of first appearance
  const categories = [...new Set(useCases.map((uc) => uc.category_label))];

  return (
    <div className="bg-base-100 min-h-screen">
      <ExploreContent
        allUseCases={allUseCases}
        featuredUseCases={featured}
        categories={categories}
      />
      <Footer />
    </div>
  );
}
