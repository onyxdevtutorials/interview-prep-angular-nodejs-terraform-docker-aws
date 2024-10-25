import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersFormComponent } from './users-form.component';
import { User, UserStatus } from '@onyxdevtutorials/interview-prep-shared';
import { By } from '@angular/platform-browser';
import { MatSelectHarness } from '@angular/material/select/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('UsersFormComponent', () => {
  let component: UsersFormComponent;
  let fixture: ComponentFixture<UsersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersFormComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls and validators', () => {
    const userForm = component.userForm;

    expect(userForm.controls.first_name).toBeDefined();
    expect(userForm.controls.last_name).toBeDefined();
    expect(userForm.controls.email).toBeDefined();
    expect(userForm.controls.status).toBeDefined();

    const firstNameControl = userForm.get('first_name');
    const lastNameControl = userForm.get('last_name');
    const emailControl = userForm.get('email');
    const statusControl = userForm.get('status');

    expect(firstNameControl?.hasValidator(Validators.required)).toBeTrue();
    expect(lastNameControl?.hasValidator(Validators.required)).toBeTrue();
    expect(emailControl?.hasValidator(Validators.required)).toBeTrue();
    expect(emailControl?.hasValidator(Validators.email)).toBeTrue();
    expect(statusControl?.hasValidator(Validators.required)).toBeTrue();
  });

  it('should patch form values when user input changes, e.g., used by UsersUpdateComponent', () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      status: UserStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };

    component.user = user;
    component.ngOnChanges({
      user: {
        currentValue: user,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.userForm.value).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      status: UserStatus.ACTIVE,
    });
  });

  it('should emit formSubmit event when form is submitted', () => {
    spyOn(component.formSubmit, 'emit');

    component.userForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>);

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>);
  });

  it('should not emit formSubmit event when form is invalid', () => {
    spyOn(component.formSubmit, 'emit');

    component.userForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'invalid email',
      status: UserStatus.ACTIVE,
    } as Omit<User, 'id'>);

    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should display validation errors when form is invalid', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const firstNameInput = fixture.debugElement.query(
      By.css('input[formControlName="first_name"]')
    )?.nativeElement;
    const lastNameInput = fixture.debugElement.query(
      By.css('input[formControlName="last_name"]')
    )?.nativeElement;
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    )?.nativeElement;
    const statusSelect = await loader.getHarness(
      MatSelectHarness.with({
        selector: 'mat-select[formControlName="status"]',
      })
    );

    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));

    lastNameInput.value = '';
    lastNameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'invalid email';
    emailInput.dispatchEvent(new Event('input'));

    await statusSelect.open();
    await statusSelect.close();

    fixture.detectChanges();

    const firstNameError = fixture.debugElement.query(
      By.css('.first-name-error')
    )?.nativeElement;
    const lastNameError = fixture.debugElement.query(
      By.css('.last-name-error')
    )?.nativeElement;
    const emailError = fixture.debugElement.query(
      By.css('.email-error')
    )?.nativeElement;
    const statusError = fixture.debugElement.query(
      By.css('.status-error')
    )?.nativeElement;

    expect(firstNameError).toBeTruthy();
    expect(lastNameError).toBeTruthy();
    expect(emailError).toBeTruthy();
    expect(statusError).toBeTruthy();
  });
});
