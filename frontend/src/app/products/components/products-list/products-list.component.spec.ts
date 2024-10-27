import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductsService } from '../../services/products.service';
import { MockProductsService } from '../../mocks/mock-products.service';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let mockProductsService: MockProductsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsListComponent,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter(routes),
        { provide: ProductsService, useClass: MockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    mockProductsService = TestBed.inject(
      ProductsService
    ) as unknown as MockProductsService;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should inject ProductsService and MatSnackBar', () => {
    expect(component.productsService).toBeDefined();
    expect(component.snackBar).toBeDefined();
  });

  it('should have an initial empty productsSubject', () => {
    spyOn(mockProductsService, 'getProducts').and.returnValue(of([]));
    fixture.detectChanges();
    component.products$.subscribe((products) => {
      expect(products).toEqual([]);
    });
  });

  it('should retrieve products on ngOnInit', () => {
    spyOn(mockProductsService, 'getProducts').and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    expect(mockProductsService.getProducts).toHaveBeenCalled();
  });

  it('should display error in MatSnackBar if error encountered when retrieving products', () => {
    spyOn(mockProductsService, 'getProducts').and.returnValue(
      throwError(() => new Error('Simulated network error'))
    );
    spyOn(component.snackBar, 'open');
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Error getting products',
      'Close',
      { duration: 5000 }
    );
  });
});
