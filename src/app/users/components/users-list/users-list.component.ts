import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  @Input() users: User[] = [];
  @Input() filterCriteria: (user: User) => boolean = () => true;

  get filteredUsers(): User[] {
    return this.users.filter(this.filterCriteria);
  }
}
