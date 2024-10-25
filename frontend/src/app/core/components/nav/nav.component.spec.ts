import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { NavComponent } from './nav.component';
import { routes } from '../../../app.routes';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent, MatMenuModule, BrowserAnimationsModule],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display links', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have a link to the home page', () => {
    const homeLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    expect(homeLink).toBeTruthy();
  });

  it('should trigger Users menu', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const usersMenu = await loader.getHarness(
      MatMenuHarness.with({ triggerText: 'Users' })
    );
    expect(usersMenu).toBeTruthy();

    await usersMenu.open();
    const items = await usersMenu.getItems();
    expect(items.length).toBe(2);
  });

  it('should trigger Products menu', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const productsMenu = await loader.getHarness(
      MatMenuHarness.with({ triggerText: 'Products' })
    );
    expect(productsMenu).toBeTruthy();

    await productsMenu.open();
    const items = await productsMenu.getItems();
    expect(items.length).toBe(2);
  });
});
