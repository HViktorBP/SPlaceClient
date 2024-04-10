import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGroupComponent } from './leave-group.component';

describe('LeaveGroupComponent', () => {
  let component: LeaveGroupComponent;
  let fixture: ComponentFixture<LeaveGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveGroupComponent]
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
