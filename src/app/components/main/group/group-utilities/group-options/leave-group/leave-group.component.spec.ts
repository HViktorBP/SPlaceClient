import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveGroupComponent} from './leave-group.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LeaveGroupComponent', () => {
  let component: LeaveGroupComponent;
  let fixture: ComponentFixture<LeaveGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LeaveGroupComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(LeaveGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
