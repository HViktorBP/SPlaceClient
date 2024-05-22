import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUsernameComponent } from './change-username.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ChangeUsernameComponent', () => {
  let component: ChangeUsernameComponent;
  let fixture: ComponentFixture<ChangeUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUsernameComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
