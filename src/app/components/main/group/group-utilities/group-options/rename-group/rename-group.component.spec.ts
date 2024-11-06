import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RenameGroupComponent} from './rename-group.component';

describe('RenameGroupComponent', () => {
  let component: RenameGroupComponent;
  let fixture: ComponentFixture<RenameGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
