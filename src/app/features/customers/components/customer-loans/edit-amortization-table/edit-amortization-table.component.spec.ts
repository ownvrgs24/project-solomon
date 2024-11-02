import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmortizationTableComponent } from './edit-amortization-table.component';

describe('EditAmortizationTableComponent', () => {
  let component: EditAmortizationTableComponent;
  let fixture: ComponentFixture<EditAmortizationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAmortizationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAmortizationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
