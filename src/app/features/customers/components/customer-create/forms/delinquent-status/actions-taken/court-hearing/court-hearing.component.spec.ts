import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtHearingComponent } from './court-hearing.component';

describe('CourtHearingComponent', () => {
  let component: CourtHearingComponent;
  let fixture: ComponentFixture<CourtHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtHearingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
