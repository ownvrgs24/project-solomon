import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddLoanComponent } from './customer-add-loan.component';

describe('CustomerAddLoanComponent', () => {
  let component: CustomerAddLoanComponent;
  let fixture: ComponentFixture<CustomerAddLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAddLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAddLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
