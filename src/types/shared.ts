export interface IProductData {
  id: number;
  name: string;
  featuredImage: string;
  quantity: number;
  published: boolean;
  price: string;
  discountPrice: string;
  brand: string;
  createdBy: { name: string };
  createdAt: string;
  outOfStock: boolean;
  description: string;
  category: { id: number; name: string };
  mainCategory: { id: number; name: string };
  store: { storeName: string };
  images: string;
  avgRating: number;
}

export interface ICategory {
  name: string;
  id: number;
  description: string;
  createdAt: string;
  featuredImage: string;
  mainCategory: { name: string; id: number };
}

export interface IAdmin {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}
