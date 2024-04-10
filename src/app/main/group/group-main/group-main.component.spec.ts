import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMainComponent } from './group-main.component';

describe('GroupMainComponent', () => {
  let component: GroupMainComponent;
  let fixture: ComponentFixture<GroupMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
