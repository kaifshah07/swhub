export default function AdvertisementCard() {
  return (
    <div className="col-span-2 overflow-hidden rounded-3xl bg-gradient-to-r from-error to-accent shadow-lg">

      <div className="grid h-full md:grid-cols-2">

        {/* Content */}
        <div className="flex flex-col justify-center p-6 text-white">
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
            Limited Offer
          </span>

          <h3 className="mb-3 text-2xl font-extrabold leading-tight">
            Up To 60% OFF
            <br />
            Home Essentials
          </h3>

          <p className="mb-5 text-sm text-white/90">
            Trending kitchenware, groceries and cleaning supplies
            for everyday needs.
          </p>

          <button className="w-fit rounded-xl bg-white px-5 py-2 font-semibold text-red-600 transition hover:scale-105">
            Shop Now →
          </button>
        </div>

        {/* Image */}
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1000"
            alt="Home Essentials Sale"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}