import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../services/users.service';
import { MockUsersService } from '../../mocks/mock-users.service';
import { provideRouter, Router } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUsersService: MockUsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        provideRouter(routes),
        { provide: UsersService, useClass: MockUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    mockUsersService = TestBed.inject(
      UsersService
    ) as unknown as MockUsersService;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should inject UsersService and MatSnackBar', () => {
    expect(component.usersService).toBeDefined();
    expect(component.snackBar).toBeDefined();
  });

  it('should have an initial empty usersSubject', () => {
    spyOn(mockUsersService, 'getUsers').and.returnValue(of([]));
    fixture.detectChanges();
    component.users$.subscribe((users) => {
      expect(users).toEqual([]);
    });
  });

  it('should retrieve users on ngOnInit', () => {
    spyOn(mockUsersService, 'getUsers').and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
  });

  it('should should display error in MatSnackBar if error encountered when retrieving users', () => {
    spyOn(mockUsersService, 'getUsers').and.returnValue(
      throwError(() => new Error('Simulated network error'))
    );
    spyOn(component.snackBar, 'open');
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Error getting users',
      'Close',
      { duration: 5000 }
    );
  });
});
