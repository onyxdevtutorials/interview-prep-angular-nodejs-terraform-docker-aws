import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../../services/users.service';
import { Observable, of } from 'rxjs';
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

  users$: Observable<User[]> = of([]);

  // bUsersFilter = (user: User) => user.lastName.startsWith('B');

  ngOnInit(): void {
    this.users$ = this.usersService.getUsers();
  }

  // @Input() users: User[] = [];
  // @Input() filterCriteria: (user: User) => boolean = () => true;

  // get filteredUsers(): User[] {
  //   return this.users.filter(this.filterCriteria);
  // }
}
