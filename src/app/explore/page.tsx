import useCases from "@/data/use-cases.json";
import ExploreContent from "@/components/explore/ExploreContent";

export const metadata = {
  title: "Explore Tools | Booey",
  description: "Browse all tools — recipes, emails, budgets, and more.",
};

const FEATURED_IDS = [
  "healthy-recipe",
  "difficult-email",
  "bill-negotiation",
  "gift-ideas",
  "meal-plan-week",
];

export default function ExplorePage() {
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
    <div className="bg-base-100 min-h-screen pb-32">
      <ExploreContent
        allUseCases={allUseCases}
        featuredUseCases={featured}
        categories={categories}
      />
    </div>
  );
}
