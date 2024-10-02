import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEmployedComponent } from './self-employed.component';

describe('SelfEmployedComponent', () => {
  let component: SelfEmployedComponent;
  let fixture: ComponentFixture<SelfEmployedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEmployedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEmployedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
