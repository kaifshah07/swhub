interface PageHeroProps {
  title: string;
  subtitle: string;
}

export default function PageHero({
  title,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="bg-gradient-to-r from-error via-accent to-accent py-16">
      <div className="max-w-7xl mx-auto px-4 text-white">

        <h1 className="text-4xl md:text-6xl font-black">
          {title}
        </h1>

        <p className="mt-4 text-lg">
          {subtitle}
        </p>

      </div>
    </section>
  );
}