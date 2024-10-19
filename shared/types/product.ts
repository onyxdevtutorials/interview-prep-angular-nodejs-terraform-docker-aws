import { ProductStatus } from './productStatus';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  status: ProductStatus;
  created_at?: Date;
  updated_at?: Date;
}
