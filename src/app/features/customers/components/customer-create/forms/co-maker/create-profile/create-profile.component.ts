import { Component, Input, signal } from '@angular/core';
import { PersonalInformationFormComponent } from '../../personal-information-form/personal-information-form.component';
import { AddressFormComponent } from '../../address-form/address-form.component';
import { ShellCollateralsFormComponent } from '../../collaterals/shell-collaterals-form.component';
import { ShellSourceOfIncomeComponent } from '../../source-of-income/shell-source-of-income.component';
import { ShellCoMakerComponent } from '../shell-co-maker.component';
import { ProfilePictureFormComponent } from '../../profile-picture-form/profile-picture-form.component';
import { PromissoryNoteComponent } from '../../promissory-note/promissory-note.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ArchivesComponent } from '../../archives/archives.component';
import { DelinquentStatusComponent } from '../../delinquent-status/delinquent-status.component';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [
    CardModule,
    TabViewModule,
    PersonalInformationFormComponent,
    AddressFormComponent,
    ShellCollateralsFormComponent,
    ShellSourceOfIncomeComponent,
    ShellCoMakerComponent,
    ProfilePictureFormComponent,
    PromissoryNoteComponent,
    ArchivesComponent,
    DelinquentStatusComponent,
  ],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss',
})
export class CreateProfileComponent {
  activeIndex: number = 0;

  @Input({ required: true }) customerId!: string | null;

  comakerId = signal<string | null>(null);

  onCoMakerProfileCreated($event: string): void {
    this.comakerId.set($event);

    setTimeout(() => {
      this.activeIndex++;
    }, 1500);
  }

  get isCoMakerProfileCreated(): boolean {
    return !this.comakerId();
  }
}
