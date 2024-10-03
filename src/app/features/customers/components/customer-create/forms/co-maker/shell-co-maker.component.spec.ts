import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellCoMakerComponent } from './shell-co-maker/shell-co-maker.component';

describe('ShellCoMakerComponent', () => {
  let component: ShellCoMakerComponent;
  let fixture: ComponentFixture<ShellCoMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellCoMakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellCoMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
