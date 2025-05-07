import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTripDetailComponent } from './customer-trip-detail.component';

describe('CustomerTripDetailComponent', () => {
  let component: CustomerTripDetailComponent;
  let fixture: ComponentFixture<CustomerTripDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerTripDetailComponent]
    });
    fixture = TestBed.createComponent(CustomerTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
