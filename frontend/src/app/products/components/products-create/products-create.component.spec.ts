import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { MockProductsService } from '../../mocks/mock-products.service';
import { ProductsService } from '../../services/products.service';
import { ProductsCreateComponent } from './products-create.component';
import { routes } from 'src/app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  Product,
  ProductStatus,
} from '@onyxdevtutorials/interview-prep-shared';
import { mockProducts } from '../../mocks/mock-products';
import { of, throwError } from 'rxjs';

describe('ProductsCreateComponent', () => {
  let component: ProductsCreateComponent;
  let fixture: ComponentFixture<ProductsCreateComponent>;
  let mockProductsService: MockProductsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCreateComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter(routes),
        { provide: ProductsService, useClass: MockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsCreateComponent);
    component = fixture.componentInstance;
    // First cast the ProductsService instance to unknown, which is a type-safe way to bypass TypeScript's type checking
    mockProductsService = TestBed.inject(
      ProductsService
    ) as unknown as MockProductsService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createProduct on ProductsService when handleFormSubmit is called', () => {
    const formData = {
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      status: ProductStatus.PENDING,
    } as Omit<Product, 'id'>;

    spyOn(mockProductsService, 'createProduct').and.returnValue(
      of({
        ...formData,
        id: mockProducts.length + 1,
      })
    );
    component.handleFormSubmit(formData);
    expect(mockProductsService.createProduct).toHaveBeenCalledWith(formData);
  });

  it('should navigate to /products after product is created', () => {
    const formData = {
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      status: ProductStatus.PENDING,
    } as Omit<Product, 'id'>;

    spyOn(mockProductsService, 'createProduct').and.returnValue(
      of({
        ...formData,
        id: mockProducts.length + 1,
      })
    );
    spyOn(router, 'navigate');
    component.handleFormSubmit(formData);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle error when createProduct fails', () => {
    const formData = {
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      status: ProductStatus.PENDING,
    } as Omit<Product, 'id'>;

    const errorResponse = new Error('Error creating product');

    spyOn(mockProductsService, 'createProduct').and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');
    component.handleFormSubmit(formData);
    expect(console.error).toHaveBeenCalledWith(
      'Error creating product:',
      errorResponse
    );
  });
});
