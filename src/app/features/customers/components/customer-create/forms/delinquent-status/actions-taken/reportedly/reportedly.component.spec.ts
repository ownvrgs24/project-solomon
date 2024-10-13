import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedlyComponent } from './reportedly.component';

describe('ReportedlyComponent', () => {
  let component: ReportedlyComponent;
  let fixture: ComponentFixture<ReportedlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedlyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportedlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
