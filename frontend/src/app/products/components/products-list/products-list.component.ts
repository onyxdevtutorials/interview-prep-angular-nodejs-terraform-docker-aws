import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { Product } from '../../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../../services/products.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule, PricePipe],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  productsService = inject(ProductsService);
  snackBar = inject(MatSnackBar);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (error) => {
        console.error('Error getting products:', error);
        this.snackBar.open('Error getting products', 'Close', {
          duration: 5000,
        });
      },
      complete: () => console.log('Products retrieval complete'),
    });
  }
}
