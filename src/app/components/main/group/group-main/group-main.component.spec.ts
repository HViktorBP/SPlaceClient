import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {GroupMainComponent} from './group-main.component';

describe('GroupMainComponent', () => {
  let component: GroupMainComponent;
  let fixture: ComponentFixture<GroupMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMainComponent, RouterTestingModule, HttpClientTestingModule]
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
