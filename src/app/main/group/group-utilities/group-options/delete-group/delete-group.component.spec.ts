import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGroupComponent } from './delete-group.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DeleteGroupComponent', () => {
  let component: DeleteGroupComponent;
  let fixture: ComponentFixture<DeleteGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGroupComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
