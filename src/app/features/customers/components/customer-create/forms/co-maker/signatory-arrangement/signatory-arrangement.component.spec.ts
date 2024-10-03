import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatoryArrangementComponent } from './signatory-arrangement.component';

describe('SignatoryArrangementComponent', () => {
  let component: SignatoryArrangementComponent;
  let fixture: ComponentFixture<SignatoryArrangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatoryArrangementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatoryArrangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
