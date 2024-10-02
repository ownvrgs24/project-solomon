import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellSourceOfIncomeComponent } from './shell-source-of-income.component';

describe('ShellSourceOfIncomeComponent', () => {
  let component: ShellSourceOfIncomeComponent;
  let fixture: ComponentFixture<ShellSourceOfIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellSourceOfIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellSourceOfIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
