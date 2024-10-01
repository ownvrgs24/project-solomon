import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseAndLotComponent } from './house-and-lot.component';

describe('HouseAndLotComponent', () => {
  let component: HouseAndLotComponent;
  let fixture: ComponentFixture<HouseAndLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseAndLotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseAndLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
