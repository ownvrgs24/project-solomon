import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalLoanComponent } from './principal-loan.component';

describe('PrincipalLoanComponent', () => {
  let component: PrincipalLoanComponent;
  let fixture: ComponentFixture<PrincipalLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
