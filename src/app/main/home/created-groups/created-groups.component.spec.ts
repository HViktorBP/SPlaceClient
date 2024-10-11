import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedGroupsComponent } from './created-groups.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GroupsInfoComponent', () => {
  let component: CreatedGroupsComponent;
  let fixture: ComponentFixture<CreatedGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedGroupsComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
