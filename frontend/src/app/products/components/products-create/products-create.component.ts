import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductsFormComponent } from '../products-form/products-form.component';
import { Product } from '@shared/types/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-create',
  standalone: true,
  imports: [ProductsCreateComponent, ProductsFormComponent],
  templateUrl: './products-create.component.html',
  styleUrl: './products-create.component.scss',
})
export class ProductsCreateComponent {
  productsService = inject(ProductsService);
  router = inject(Router);

  handleFormSubmit(formData: Omit<Product, 'id'>): void {
    console.log(formData);
    this.productsService.createProduct(formData).subscribe({
      next: (product) => {
        console.log('Product created:', product);
        this.router.navigate(['/products']);
      },
      error: (error) => console.error('Error creating product:', error),
      complete: () => console.log('Product creation complete'),
    });
  }
}
