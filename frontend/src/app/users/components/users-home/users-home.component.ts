import { Component } from '@angular/core';
import { UsersListComponent } from '../users-list/users-list.component';
import { UsersCreateComponent } from '../users-create/users-create.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-users-home',
  standalone: true,
  imports: [
    CommonModule,
    UsersListComponent,
    RouterOutlet,
    UsersCreateComponent,
  ],
  templateUrl: './users-home.component.html',
  styleUrl: './users-home.component.scss',
})
export class UsersHomeComponent {}
