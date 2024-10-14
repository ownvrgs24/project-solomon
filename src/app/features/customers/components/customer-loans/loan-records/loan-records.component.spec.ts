import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRecordsComponent } from './loan-records.component';

describe('LoanRecordsComponent', () => {
  let component: LoanRecordsComponent;
  let fixture: ComponentFixture<LoanRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
