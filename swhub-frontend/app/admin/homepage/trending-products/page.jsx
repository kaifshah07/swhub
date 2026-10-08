"use client";

import ProductSectionManager
from "../components/ProductSectionManager";

export default function Page() {
  return (
    <ProductSectionManager
      sectionKey="trending-products"
      title="Trending Products"
    />
  );
}