import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteComponent } from './promissory-note.component';

describe('PromissoryNoteComponent', () => {
  let component: PromissoryNoteComponent;
  let fixture: ComponentFixture<PromissoryNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromissoryNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromissoryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
