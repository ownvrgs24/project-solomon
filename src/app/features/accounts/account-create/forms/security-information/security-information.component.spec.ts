import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityInformationComponent } from './security-information.component';

describe('SecurityInformationComponent', () => {
  let component: SecurityInformationComponent;
  let fixture: ComponentFixture<SecurityInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
