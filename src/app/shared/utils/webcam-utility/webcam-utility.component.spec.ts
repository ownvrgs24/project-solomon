import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamUtilityComponent } from './webcam-utility.component';

describe('WebcamUtilityComponent', () => {
  let component: WebcamUtilityComponent;
  let fixture: ComponentFixture<WebcamUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebcamUtilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebcamUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
