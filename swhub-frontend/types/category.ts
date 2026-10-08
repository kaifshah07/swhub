export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder?: number;
  isActive: boolean;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder?: number;
  isActive: boolean;
  subcategories?: Subcategory[];
  _count?: {
    products?: number;
    subcategories?: number;
  };
}
