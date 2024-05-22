import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusComponent } from './change-status.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ChangeStatusComponent', () => {
  let component: ChangeStatusComponent;
  let fixture: ComponentFixture<ChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStatusComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
