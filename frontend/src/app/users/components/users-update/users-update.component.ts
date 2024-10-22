import { Component, inject, OnInit, input } from '@angular/core';
import { UsersFormComponent } from '../users-form/users-form.component';
import { UsersService } from '../../services/users.service';
import { User } from '@onyxdevtutorials/interview-prep-shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-update',
  standalone: true,
  imports: [UsersFormComponent],
  templateUrl: './users-update.component.html',
  styleUrl: './users-update.component.scss',
})
export class UsersUpdateComponent implements OnInit {
  usersService = inject(UsersService);
  router = inject(Router);

  userId = input.required<string>();

  userData: User | null = null;

  handleFormSubmit(formData: Omit<User, 'id'>): void {
    console.log(formData);
    this.usersService.updateUser(this.userId(), formData).subscribe({
      next: (user) => {
        console.log('User updated:', user);
        this.router.navigate(['/users']);
      },
      error: (error) => console.error('Error updating user:', error),
      complete: () => console.log('User update complete'),
    });
  }

  ngOnInit(): void {
    this.usersService.getUser(this.userId()).subscribe({
      next: (user) => {
        console.log('users-update component User:', user);
        this.userData = user;
      },
      error: (error) => console.error('Error getting user:', error),
      complete: () => console.log('User retrieval complete'),
    });
  }
}
