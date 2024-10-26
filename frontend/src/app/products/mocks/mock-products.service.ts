import { of } from 'rxjs';
import { mockProducts } from './mock-products';
import { Product } from '@onyxdevtutorials/interview-prep-shared';

export class MockProductsService {
  getProducts() {
    return of(mockProducts);
  }

  getProduct(id: string) {
    return of(mockProducts.find((p) => p.id === parseInt(id, 10)));
  }

  updateProduct(id: string, product: Omit<Product, 'id'>) {
    const index = mockProducts.findIndex((p) => p.id.toString() === id);
    if (index !== -1) {
      mockProducts[index] = {
        id: parseInt(id, 10),
        ...product,
      };
      return of(mockProducts[index]);
    } else {
      return of(null);
    }
  }

  createProduct(product: Omit<Product, 'id'>) {
    return of({
      id: Math.max(...mockProducts.map((p) => p.id)) + 1,
      ...product,
    });
  }
}
