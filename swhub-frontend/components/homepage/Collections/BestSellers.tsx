import ProductGrid from "../Products/ProductGrid";

export default function BestSellers() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-14">

        <h2 className="text-3xl font-bold mb-8">
          Best Sellers
        </h2>

        <ProductGrid />

      </div>
    </section>
  );
}