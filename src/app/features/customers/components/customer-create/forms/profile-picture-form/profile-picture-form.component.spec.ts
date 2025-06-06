import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureFormComponent } from './profile-picture-form.component';

describe('ProfilePictureFormComponent', () => {
  let component: ProfilePictureFormComponent;
  let fixture: ComponentFixture<ProfilePictureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePictureFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePictureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
