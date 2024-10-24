import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { MockUsersService } from '../../mocks/mock-users.service';
import { UsersService } from '../../services/users.service';
import { UsersCreateComponent } from './users-create.component';
import { routes } from '../../../app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User, UserStatus } from '@onyxdevtutorials/interview-prep-shared';
import { mockUsers } from '../../mocks/mock-users';
import { of, throwError } from 'rxjs';

fdescribe('UsersCreateComponent', () => {
  let component: UsersCreateComponent;
  let fixture: ComponentFixture<UsersCreateComponent>;
  let mockUsersService: MockUsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCreateComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter(routes),
        { provide: UsersService, useClass: MockUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersCreateComponent);
    component = fixture.componentInstance;
    mockUsersService = TestBed.inject(
      UsersService
    ) as unknown as MockUsersService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUser on UsersService when handleFormSubmit is called', () => {
    const formData = {
      first_name: 'Jerry',
      last_name: 'Doe',
      email: 'jerry.doe@xyz.com',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>;

    spyOn(mockUsersService, 'createUser').and.returnValue(
      of({
        ...formData,
        id: mockUsers.length + 1,
      })
    );
    component.handleFormSubmit(formData);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(formData);
  });

  it('should navigate to /users after user is created', () => {
    const formData = {
      first_name: 'Jerry',
      last_name: 'Doe',
      email: 'jerry.doe@xyz.com',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>;

    spyOn(mockUsersService, 'createUser').and.returnValue(
      of({
        ...formData,
        id: mockUsers.length + 1,
      })
    );
    spyOn(router, 'navigate');
    component.handleFormSubmit(formData);
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle error when user creation fails', () => {
    const formData = {
      first_name: 'Jerry',
      last_name: 'Doe',
      email: 'jerry.doe@xyz.com',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>;

    const errorResponse = new Error('User creation failed');
    spyOn(mockUsersService, 'createUser').and.returnValue(
      throwError(() => errorResponse)
    );
    spyOn(console, 'error');
    component.handleFormSubmit(formData);
    expect(console.error).toHaveBeenCalledWith(
      'Error creating user:',
      errorResponse
    );
  });
});
