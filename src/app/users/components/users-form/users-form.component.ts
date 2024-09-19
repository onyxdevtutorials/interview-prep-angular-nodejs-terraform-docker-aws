import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss',
})
export class UsersFormComponent {
  @Output() formSubmit = new EventEmitter<Omit<User, 'id'>>();

  fb = inject(FormBuilder);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    isActive: [false],
  });

  onSubmit(): void {
    console.log(this.userForm.value);

    if (this.userForm.valid) {
      const formValue = this.userForm.value as Omit<User, 'id'>;
      this.formSubmit.emit(formValue);
    }
  }
}
