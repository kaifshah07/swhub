import ProductCard from "@/components/homepage/Products/ProductCard";

const products = [
  {
    id: 1,
    name: "Premium Dinner Set",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800",
    price: 799,
    originalPrice: 1299,
    discount: 40,
  },

  {
    id: 2,
    name: "Fresh Tea Combo",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
    price: 699,
    originalPrice: 999,
    discount: 30,
  },

  {
    id: 3,
    name: "Kitchen Storage Set",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
    price: 999,
    originalPrice: 1499,
    discount: 35,
  },

  {
    id: 4,
    name: "Daily Snacks Pack",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800",
    price: 899,
    originalPrice: 1399,
    discount: 36,
  },
];

export default function RelatedProducts() {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-3xl font-bold">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}