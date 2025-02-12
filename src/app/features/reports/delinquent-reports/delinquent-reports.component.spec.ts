import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelinquentReportsComponent } from './delinquent-reports.component';

describe('DelinquentReportsComponent', () => {
  let component: DelinquentReportsComponent;
  let fixture: ComponentFixture<DelinquentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelinquentReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelinquentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
