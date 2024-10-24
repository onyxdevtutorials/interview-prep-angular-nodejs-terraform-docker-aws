import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsUpdateComponent } from './products-update.component';
import { ProductsService } from '../../services/products.service';

describe('ProductsUpdateComponent', () => {
  let component: ProductsUpdateComponent;
  let fixture: ComponentFixture<ProductsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsUpdateComponent, BrowserAnimationsModule],
      providers: [provideHttpClient(), ProductsService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsUpdateComponent);

    // One method of setting the productId input. The other is the TestHost method.
    fixture.componentRef.setInput('productId', '123');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
