export interface IProductData {
  id: number;
  name: string;
  featuredImage: string;
  quantity: number;
  published: boolean;
  price: number;
  discountPrice: number;
  brand: string;
  createdBy: { name: string };
  createdAt: string;
}

export interface ICategory {
  name: string;
  id: number;
  description: string;
  createdAt: string;
  featuredImage: string;
  mainCategory: { name: string };
}
