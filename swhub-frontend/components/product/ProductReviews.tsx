export default function ProductReviews() {
  return (
    <section className="mt-16">

      <h2 className="mb-6 text-3xl font-bold">
        Customer Reviews
      </h2>

      <div className="space-y-4">

        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">
            Rahul Sharma
          </h4>

          <p className="text-slate-600">
            ⭐⭐⭐⭐⭐
          </p>

          <p className="mt-2 text-slate-600">
            Excellent quality product.
          </p>
        </div>

        <div className="rounded-2xl border p-5">
          <h4 className="font-semibold">
            Priya Patel
          </h4>

          <p className="text-slate-600">
            ⭐⭐⭐⭐⭐
          </p>

          <p className="mt-2 text-slate-600">
            My child loved it.
          </p>
        </div>

      </div>
    </section>
  );
}