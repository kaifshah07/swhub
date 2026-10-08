const collections = [
  {
    title: "School Essentials",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
  },
  {
    title: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200",
  },
  {
    title: "Birthday Collection",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200",
  },
  {
    title: "Festival Collection",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-8">
          Featured Collections
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {collections.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-3xl"
            >
              <div className="relative h-[320px]">

                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-3xl font-bold">
                    {item.title}
                  </h3>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}