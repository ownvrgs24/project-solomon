import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandNoticeComponent } from './demand-notice.component';

describe('DemandNoticeComponent', () => {
  let component: DemandNoticeComponent;
  let fixture: ComponentFixture<DemandNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
