import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComponent } from './info.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
