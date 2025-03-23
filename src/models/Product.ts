export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  categoryId?: string;
  category: string;
  images: any;
  previewImages: string[];
  mainImage?: any;
  previewMainImage?: string;
}
