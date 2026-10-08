import ProductGrid from "../Products/ProductGrid";

export default function NewArrivals() {
  return (
    <section className="bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 py-14">

        <h2 className="text-3xl font-bold mb-8">
          New Arrivals
        </h2>

        <ProductGrid />

      </div>
    </section>
  );
}