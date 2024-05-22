import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRedirectComponent } from './options-redirect.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('OptionsComponent', () => {
  let component: OptionsRedirectComponent;
  let fixture: ComponentFixture<OptionsRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsRedirectComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
