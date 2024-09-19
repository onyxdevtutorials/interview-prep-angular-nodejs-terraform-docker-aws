import { Routes } from '@angular/router';
import { ProductsHomeComponent } from './products/components/products-home/products-home.component';
import { UsersHomeComponent } from './users/components/users-home/users-home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductsHomeComponent,
  },
  {
    path: 'users',
    component: UsersHomeComponent,
  },
];
