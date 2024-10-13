import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelinquentStatusComponent } from './delinquent-status.component';

describe('DelinquentStatusComponent', () => {
  let component: DelinquentStatusComponent;
  let fixture: ComponentFixture<DelinquentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelinquentStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelinquentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
