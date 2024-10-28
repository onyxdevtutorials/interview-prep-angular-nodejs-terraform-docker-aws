import { Knex } from 'knex';
import {
  Product,
  ProductStatus,
} from '@onyxdevtutorials/interview-prep-shared';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del();

  const products: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'product 1 description',
      price: 100,
      status: ProductStatus.AVAILABLE,
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'product 2 description',
      price: 200,
      status: ProductStatus.AVAILABLE,
    },
    {
      id: 3,
      name: 'Product 3',
      description: 'product 3 description',
      price: 300,
      status: ProductStatus.AVAILABLE,
    },
  ];

  await knex('products').insert(products);
}
