import { products } from "@/data/products";

export class ProductService {
  static async getProducts() {
    return products;
  }
}