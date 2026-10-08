const groups = [
  "0-2 Years",
  "2-4 Years",
  "4-6 Years",
  "6-8 Years",
  "8-12 Years",
  "Teenagers",
];

export default function AgeGroupSection() {
  return (
    <section className="py-14 bg-[#FFF7FB]">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-8">
          Shop By Age
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">

          {groups.map((group) => (
            <div
              key={group}
              className="bg-white rounded-2xl p-8 text-center font-semibold shadow hover:shadow-xl transition"
            >
              {group}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}