import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { MyErrorStateMatcher } from './error-state-matcher';

describe('MyErrorStateMatcher', () => {
  let matcher: MyErrorStateMatcher;

  beforeEach(() => {
    matcher = new MyErrorStateMatcher();
  });

  it('should return false if control is null', () => {
    const control = null;
    const form = null;
    expect(matcher.isErrorState(control, form)).toBeFalse();
  });

  it('should return false if control is not invalid', () => {
    const control = new FormControl('valid value');
    const form = null;
    expect(matcher.isErrorState(control, form)).toBeFalse();
  });

  it('should return true if control is invalid and dirty', () => {
    const control = new FormControl('', {
      validators: Validators.required,
    });
    control.markAsDirty();
    control.updateValueAndValidity();
    const form = null;
    expect(matcher.isErrorState(control, form)).toBeTrue();
  });

  it('should return true if control is invalid and touched', () => {
    const control = new FormControl('', {
      validators: Validators.required,
    });
    control.markAsTouched();
    control.updateValueAndValidity();
    const form = null;
    expect(matcher.isErrorState(control, form)).toBeTrue();
  });

  it('should return true if control is invalid and submitted', () => {
    const control = new FormControl('', {
      validators: Validators.required,
    });
    const form = new FormGroupDirective([], []);
    (form as any).submitted = true;
    control.updateValueAndValidity();
    expect(matcher.isErrorState(control, form)).toBeTrue();
  });

  it('should return false if control is invalid but pristine and untouched and form is not submitted', () => {
    const control = new FormControl('', {
      validators: Validators.required,
    });
    const form = new FormGroupDirective([], []);
    (form as any).submitted = false;
    control.updateValueAndValidity();
    expect(matcher.isErrorState(control, form)).toBeFalse();
  });
});
