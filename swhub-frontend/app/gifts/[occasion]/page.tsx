import Link from "next/link";

const labels: Record<string, string> = {
  birthday: "Birthdays",
  anniversary: "Anniversaries",
  wedding: "Weddings",
  festivals: "Festivals",
  corporate: "Corporate Gifting",
  housewarming: "Housewarmings",
  graduation: "Graduations",
};

export default async function GiftOccasionPage({
  params,
}: {
  params: Promise<{ occasion: string }>;
}) {
  const { occasion } = await params;
  const title = labels[occasion] || "Every Occasion";

  return (
    <main className="min-h-[60vh] bg-slate-50 px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
        Thoughtful gifting
      </p>
      <h1 className="mt-4 text-4xl font-bold text-slate-600">
        Gifts for {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-600">
        Explore memorable gifts selected for this special moment.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-slate-900"
      >
        Browse products
      </Link>
    </main>
  );
}
