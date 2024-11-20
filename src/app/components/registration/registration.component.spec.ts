import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { UsersService } from '../../services/users.service';
import { NgToastService } from 'ng-angular-popup';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockUserService {
  signUp() {
    return of({ message: 'Registration successful' });
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockToastService {
  success(options: any) {}
  warning(options: any) {}
  error(options: any) {}
}

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let userService: UsersService;
  let router: Router;
  let toast: NgToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: UsersService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter },
        { provide: NgToastService, useClass: MockToastService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    toast = TestBed.inject(NgToastService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registration form', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.get('username')).toBeTruthy();
    expect(component.registrationForm.get('email')).toBeTruthy();
    expect(component.registrationForm.get('password')).toBeTruthy();
    expect(component.registrationForm.get('confirmedPassword')).toBeTruthy();
  });

  it('should mark the form fields as required', () => {
    const username = component.registrationForm.get('username');
    const email = component.registrationForm.get('email');
    const password = component.registrationForm.get('password');
    const confirmedPassword = component.registrationForm.get('confirmedPassword');

    username?.setValue('');
    email?.setValue('');
    password?.setValue('');
    confirmedPassword?.setValue('');

    expect(username?.valid).toBeFalsy();
    expect(email?.valid).toBeFalsy();
    expect(password?.valid).toBeFalsy();
    expect(confirmedPassword?.valid).toBeFalsy();
    expect(username?.errors?.['required']).toBeTruthy();
    expect(email?.errors?.['required']).toBeTruthy();
    expect(password?.errors?.['required']).toBeTruthy();
    expect(confirmedPassword?.errors?.['required']).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    spyOn(toast, 'error');

    component.registrationForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmedPassword: 'differentPassword'
    });
    component.onRegister();

    expect(toast.error).toHaveBeenCalledWith({ detail: 'Error', summary: 'Passwords are not matching!', duration: 3000 });
  });

  it('should register successfully when form is valid and passwords match', () => {
    spyOn(userService, 'signUp').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(toast, 'success');

    component.registrationForm.setValue({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmedPassword: 'password123'
    });
    component.onRegister();

    expect(userService.signUp).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith({ detail: 'Success', summary: 'Registration successful', duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should show warning if form is invalid', () => {
    spyOn(toast, 'warning');

    component.registrationForm.setValue({
      username: '',
      email: '',
      password: '',
      confirmedPassword: ''
    });
    component.onRegister();

    expect(toast.warning).toHaveBeenCalledWith({ detail: 'Warning', summary: 'Please fill out the form correctly.', duration: 3000 });
  });

  it('should toggle password visibility', () => {
    expect(component.hide()).toBeTrue();
    component.togglePassword(new MouseEvent('click'));
    expect(component.hide()).toBeFalse();
    component.togglePassword(new MouseEvent('click'));
    expect(component.hide()).toBeTrue();
  });
});
