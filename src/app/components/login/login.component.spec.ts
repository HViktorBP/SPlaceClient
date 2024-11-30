import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UsersService } from '../../services/users.service';
import { NgToastService } from 'ng-angular-popup';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockUserService {
  logIn() {
    return of({ message: 'Login successful', token: '12345' });
  }

  storeUserData(token: string) {}
}

class MockRouter {
  navigate(path: string[]) {}
}

class MockToastService {
  success(options: any) {}
  warning(options: any) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UsersService;
  let router: Router;
  let toast: NgToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: UsersService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter },
        { provide: NgToastService, useClass: MockToastService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    toast = TestBed.inject(NgToastService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should mark the username and password as required', () => {
    const username = component.loginForm.get('username');
    const password = component.loginForm.get('password');

    username?.setValue('');
    password?.setValue('');

    expect(username?.valid).toBeFalsy();
    expect(password?.valid).toBeFalsy();
    expect(username?.errors?.['required']).toBeTruthy();
    expect(password?.errors?.['required']).toBeTruthy();
  });

  it('should log in successfully when form is valid', () => {
    spyOn(userService, 'logIn').and.callThrough();
    spyOn(router, 'navigate');
    spyOn(toast, 'success');
    spyOn(userService, 'storeUserData');

    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.onLogin();

    expect(userService.logIn).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith({ detail: 'Success', summary: 'Login successful', duration: 3000 });
    expect(userService.storeUserData).toHaveBeenCalledWith('12345');
    expect(router.navigate).toHaveBeenCalledWith(['main']);
  });

  it('should show warning if form is invalid', () => {
    spyOn(toast, 'warning');

    component.loginForm.setValue({ username: '', password: '' });
    component.onLogin();

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
