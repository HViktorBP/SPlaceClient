import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutAppComponent } from './about-app.component';
import { MatDialogRef } from '@angular/material/dialog';
import createSpyObj = jasmine.createSpyObj;
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AboutAppComponent>>;

describe('AboutAppComponent', () => {
  let component: AboutAppComponent;
  let fixture: ComponentFixture<AboutAppComponent>;

  beforeEach(async () => {
    dialogRefSpy = createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ AboutAppComponent, BrowserAnimationsModule, HttpClientTestingModule ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close on dialogRef when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('button'));
    if (closeButton) {
      closeButton.triggerEventHandler('click', null);
    } else {
      fail('Close button not found');
    }
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
