import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnListComponent } from './turn-list.component';

describe('TurnListComponent', () => {
  let component: TurnListComponent;
  let fixture: ComponentFixture<TurnListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnListComponent]
    });
    fixture = TestBed.createComponent(TurnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
