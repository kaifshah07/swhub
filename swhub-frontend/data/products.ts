import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    image: "/images/headphones.png",
    rating: 4.8,
    stock: 30,
    category: "Electronics",
    vendor: "Tech Store",
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: 1499,
    image: "/images/mouse.png",
    rating: 4.5,
    stock: 18,
    category: "Electronics",
    vendor: "Game World",
  },
];