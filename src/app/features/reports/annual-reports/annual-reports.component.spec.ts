import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualReportsComponent } from './annual-reports.component';

describe('AnnualReportsComponent', () => {
  let component: AnnualReportsComponent;
  let fixture: ComponentFixture<AnnualReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnualReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
