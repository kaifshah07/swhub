"use client";

import { useState } from "react";

type ProductGalleryProps = {
  product: any;
};

export default function ProductGallery({
  product,
}: ProductGalleryProps) {
  const image =
    product.thumbnail || "/placeholder.png";

  const [selected, setSelected] =
    useState(image);

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border bg-white">

        <img
          src={selected}
          alt={product.name}
          className="h-[500px] w-full object-cover"
        />

      </div>

      <div className="mt-5">
        <button
          onClick={() => setSelected(image)}
          className="overflow-hidden rounded-2xl border-2 border-red-200"
        >
          <img
            src={image}
            alt={product.name}
            className="h-28 w-28 object-cover"
          />
        </button>
      </div>
    </div>
  );
}