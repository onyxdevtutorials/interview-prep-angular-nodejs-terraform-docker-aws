import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../../services/users.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  usersService = inject(UsersService);

  users$ = new BehaviorSubject<User[]>([]);

  // bUsersFilter = (user: User) => user.lastName.startsWith('B');

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users$.next(users),
      error: (error) => console.error('Error getting users:', error),
      complete: () => console.log('Users retrieval complete'),
    });
  }

  // @Input() users: User[] = [];
  // @Input() filterCriteria: (user: User) => boolean = () => true;

  // get filteredUsers(): User[] {
  //   return this.users.filter(this.filterCriteria);
  // }
}
