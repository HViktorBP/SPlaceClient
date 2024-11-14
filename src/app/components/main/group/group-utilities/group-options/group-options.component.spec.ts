import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupOptionsComponent} from './group-options.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupOptionsComponent', () => {
  let component: GroupOptionsComponent;
  let fixture: ComponentFixture<GroupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GroupOptionsComponent, RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(GroupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
