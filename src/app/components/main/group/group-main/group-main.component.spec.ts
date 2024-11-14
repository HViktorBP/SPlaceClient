import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import {GroupMainComponent} from './group-main.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupMainComponent', () => {
  let component: GroupMainComponent;
  let fixture: ComponentFixture<GroupMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GroupMainComponent, RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
