import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRedirectComponent } from './options-redirect.component';

describe('OptionsComponent', () => {
  let component: OptionsRedirectComponent;
  let fixture: ComponentFixture<OptionsRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsRedirectComponent]
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
