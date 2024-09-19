import { Routes } from '@angular/router';
import { ProductsHomeComponent } from './products/components/products-home/products-home.component';
import { UsersHomeComponent } from './users/components/users-home/users-home.component';
import { UsersUpdateComponent } from './users/components/users-update/users-update.component';
import { UsersCreateComponent } from './users/components/users-create/users-create.component';
import { UsersListComponent } from './users/components/users-list/users-list.component';

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
    children: [
      {
        path: '',
        component: UsersListComponent,
      },
      {
        path: 'new',
        component: UsersCreateComponent,
      },
      {
        path: 'update/:userId',
        component: UsersUpdateComponent,
      },
    ],
  },
];
