import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellCollateralsFormComponent } from './shell-collaterals-form.component';

describe('ShellCollateralsFormComponent', () => {
  let component: ShellCollateralsFormComponent;
  let fixture: ComponentFixture<ShellCollateralsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellCollateralsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellCollateralsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
