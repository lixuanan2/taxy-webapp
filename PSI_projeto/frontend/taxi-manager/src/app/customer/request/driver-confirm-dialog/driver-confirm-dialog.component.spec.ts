import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverConfirmDialogComponent } from './driver-confirm-dialog.component';

describe('DriverConfirmDialogComponent', () => {
  let component: DriverConfirmDialogComponent;
  let fixture: ComponentFixture<DriverConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(DriverConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
