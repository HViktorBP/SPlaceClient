import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsInfoComponent } from './groups-info.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GroupsInfoComponent', () => {
  let component: GroupsInfoComponent;
  let fixture: ComponentFixture<GroupsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsInfoComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
