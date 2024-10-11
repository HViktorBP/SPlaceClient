import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RemoveUserComponent} from './remove-user.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('RemoveUserComponent', () => {
  let component: RemoveUserComponent;
  let fixture: ComponentFixture<RemoveUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveUserComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
