import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { User } from '@shared/types/user';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  usersService = inject(UsersService);
  snackBar = inject(MatSnackBar);

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.usersSubject.next(users),
      error: (error) => {
        console.error('Error getting users:', error);
        this.snackBar.open('Error getting users', 'Close', { duration: 5000 });
      },
      complete: () => console.log('Users retrieval complete'),
    });
  }
}
