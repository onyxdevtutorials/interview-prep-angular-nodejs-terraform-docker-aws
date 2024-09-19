import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UsersListComponent } from '../users-list/users-list.component';
import { UsersCreateComponent } from '../users-create/users-create.component';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-home',
  standalone: true,
  imports: [CommonModule, UsersListComponent, UsersCreateComponent],
  templateUrl: './users-home.component.html',
  styleUrl: './users-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersHomeComponent implements OnInit {
  usersService = inject(UsersService);

  users$: Observable<User[]> = of([]);

  bUsersFilter = (user: User) => user.lastName.startsWith('B');

  ngOnInit(): void {
    this.users$ = this.usersService.getUsers();
  }
}
