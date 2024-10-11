import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUtilitiesComponent } from './group-utilities.component';

describe('GroupInfoComponent', () => {
  let component: GroupUtilitiesComponent;
  let fixture: ComponentFixture<GroupUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupUtilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
