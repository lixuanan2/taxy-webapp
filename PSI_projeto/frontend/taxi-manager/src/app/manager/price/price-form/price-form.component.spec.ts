import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFormComponent } from './price-form.component';

describe('PriceFormComponent', () => {
  let component: PriceFormComponent;
  let fixture: ComponentFixture<PriceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriceFormComponent]
    });
    fixture = TestBed.createComponent(PriceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
