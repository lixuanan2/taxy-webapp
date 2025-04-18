import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTripComponent } from './register-trip.component';

describe('RegisterTripComponent', () => {
  let component: RegisterTripComponent;
  let fixture: ComponentFixture<RegisterTripComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterTripComponent]
    });
    fixture = TestBed.createComponent(RegisterTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
