const characters = [
  {
    name: "Nestle",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
  },
  {
    name: "ITC",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500",
  },
  {
    name: "Amul",
    image:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=500",
  },
  {
    name: "HUL",
    image:
      "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500",
  },
  {
    name: "Tata",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500",
  },
  {
    name: "Britannia",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500",
  },
];

export default function CharacterZone() {
  return (
    <section className="py-16 bg-white">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-8">
          Top Trusted Brands
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {characters.map((item) => (
            <div
              key={item.name}
              className="group overflow-hidden rounded-3xl cursor-pointer"
            >
              <div className="relative h-[280px]">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">
                    {item.name}
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