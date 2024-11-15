import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMessageDeleteComponent } from './confirm-message-delete.component';

describe('ConfirmMessageDeleteComponent', () => {
  let component: ConfirmMessageDeleteComponent;
  let fixture: ComponentFixture<ConfirmMessageDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMessageDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmMessageDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
