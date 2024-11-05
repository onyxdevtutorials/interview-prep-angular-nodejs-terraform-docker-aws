import { Knex } from 'knex';
import {
  Product,
  ProductStatus,
} from '@onyxdevtutorials/interview-prep-shared';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('products').del();

  await knex.raw('ALTER SEQUENCE products_id_seq RESTART WITH 1');

  const products: Omit<Product, "id">[] = [
    {
      name: 'Product 1',
      description: 'product 1 description',
      price: 100,
      status: ProductStatus.AVAILABLE,
    },
    {
      name: 'Product 2',
      description: 'product 2 description',
      price: 200,
      status: ProductStatus.AVAILABLE,
    },
    {
      name: 'Product 3',
      description: 'product 3 description',
      price: 300,
      status: ProductStatus.AVAILABLE,
    },
  ];

  await knex('products').insert(products);
}
