import { Component, inject, OnInit, input } from '@angular/core';
import { ProductsFormComponent } from '../products-form/products-form.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '@shared/types/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-update',
  standalone: true,
  imports: [ProductsFormComponent],
  templateUrl: './products-update.component.html',
  styleUrl: './products-update.component.scss',
})
export class ProductsUpdateComponent {
  productsService = inject(ProductsService);
  router = inject(Router);

  productId = input.required<string>();

  productData: Product | null = null;

  handleFormSubmit(formData: Omit<Product, 'id'>): void {
    console.log(formData);
    this.productsService.updateProduct(this.productId(), formData).subscribe({
      next: (product) => {
        console.log('Product updated:', product);
        this.router.navigate(['/products']);
      },
      error: (error) => console.error('Error updating product:', error),
      complete: () => console.log('Product update complete'),
    });
  }

  ngOnInit(): void {
    this.productsService.getProduct(this.productId()).subscribe({
      next: (product) => {
        console.log('products-update component Product:', product);
        this.productData = product;
      },
      error: (error) => console.error('Error getting product:', error),
      complete: () => console.log('Product retrieval complete'),
    });
  }
}
