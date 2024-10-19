import {
  Component,
  inject,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '@shared/types/product';
import { ProductStatus } from '@shared/types/productStatus';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MyErrorStateMatcher } from '../../../shared/utils/error-state-matcher';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatLabel,
    MatError,
  ],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss',
})
export class ProductsFormComponent {
  @Input() product: Product | null = null;
  @Output() formSubmit = new EventEmitter<Omit<Product, 'id'>>();

  fb = inject(NonNullableFormBuilder);

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/), // positive number with up to 2 decimal places
        Validators.min(0.01),
      ],
    ],
    status: ['', Validators.required],
  });

  productStatuses = Object.values(ProductStatus);

  matcher = new MyErrorStateMatcher();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      const productWithDefaults = {
        ...this.product,
        price: this.product.price ? (this.product.price / 100).toFixed(2) : '',
      };
      this.productForm.patchValue(productWithDefaults);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product: Omit<Product, 'id'> = {
        name: formValue.name || '',
        description: formValue.description || '',
        price: formValue.price ? parseFloat(formValue.price) : 0,
        status: (formValue.status as ProductStatus) || ProductStatus.PENDING,
      };
      this.formSubmit.emit(product);
    }
  }
}
