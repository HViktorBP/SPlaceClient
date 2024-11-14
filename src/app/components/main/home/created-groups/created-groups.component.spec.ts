import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatedGroupsComponent} from './created-groups.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupsInfoComponent', () => {
  let component: CreatedGroupsComponent;
  let fixture: ComponentFixture<CreatedGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreatedGroupsComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
