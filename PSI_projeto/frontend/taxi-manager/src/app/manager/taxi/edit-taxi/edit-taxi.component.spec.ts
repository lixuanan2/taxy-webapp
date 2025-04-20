import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxiComponent } from './edit-taxi.component';

describe('EditTaxiComponent', () => {
  let component: EditTaxiComponent;
  let fixture: ComponentFixture<EditTaxiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTaxiComponent]
    });
    fixture = TestBed.createComponent(EditTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
