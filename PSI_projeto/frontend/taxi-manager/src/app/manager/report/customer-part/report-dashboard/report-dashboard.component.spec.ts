import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReportDashboardComponent } from './report-dashboard.component';

describe('CustomerReportDashboardComponent', () => {
  let component: CustomerReportDashboardComponent;
  let fixture: ComponentFixture<CustomerReportDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerReportDashboardComponent]
    });
    fixture = TestBed.createComponent(CustomerReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
