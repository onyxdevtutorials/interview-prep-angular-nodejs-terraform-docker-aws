import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Product } from '@onyxdevtutorials/interview-prep-shared';
import { HttpErrorHandlerService } from '../../core/services/http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService
  ) {}

  convertPriceToCents(price: number): number {
    return Math.round(price * 100);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => console.log('Fetched products:', products)),
      catchError(this.httpErrorHandler.handleError)
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => console.log('Fetched product:', product)),
      catchError(this.httpErrorHandler.handleError)
    );
  }

  updateProduct(id: string, product: Omit<Product, 'id'>): Observable<Product> {
    const productWithPriceInCents = {
      ...product,
      price: this.convertPriceToCents(product.price),
    };
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, productWithPriceInCents)
      .pipe(
        tap((updatedProduct) =>
          console.log('Updated product:', updatedProduct)
        ),
        catchError(this.httpErrorHandler.handleError)
      );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const productWithPriceInCents = {
      ...product,
      price: this.convertPriceToCents(product.price),
    };
    return this.http.post<Product>(this.apiUrl, productWithPriceInCents).pipe(
      tap((newProduct) => console.log('Created product:', newProduct)),
      catchError(this.httpErrorHandler.handleError)
    );
  }
}
