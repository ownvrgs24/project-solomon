import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PersonalInformationFormComponent } from './forms/personal-information-form/personal-information-form.component';
import { CardModule } from 'primeng/card';
import { AddressFormComponent } from './forms/address-form/address-form.component';
import { ShellCollateralsFormComponent } from './forms/collaterals/shell-collaterals-form.component';
import { ShellSourceOfIncomeComponent } from './forms/source-of-income/shell-source-of-income.component';
import { ProfilePictureFormComponent } from './forms/profile-picture-form/profile-picture-form.component';
import { TabViewModule } from 'primeng/tabview';
import { PromissoryNoteComponent } from './forms/promissory-note/promissory-note.component';
import { ArchivesComponent } from './forms/archives/archives.component';
import { ShellCoMakerComponent } from './forms/co-maker/shell-co-maker.component';
import { signal } from '@angular/core';
import { DelinquentStatusComponent } from './forms/delinquent-status/delinquent-status.component';
import { PrincipalLoanComponent } from "./forms/principal-loan/principal-loan.component";

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    ButtonModule,
    TabViewModule,
    PersonalInformationFormComponent,
    CardModule,
    AddressFormComponent,
    ShellCollateralsFormComponent,
    ShellSourceOfIncomeComponent,
    ProfilePictureFormComponent,
    PromissoryNoteComponent,
    ArchivesComponent,
    ShellCoMakerComponent,
    DelinquentStatusComponent,
    PrincipalLoanComponent
],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
})
export class CustomerCreateComponent {
  activeIndex: number = 0;
  customerId = signal<string | null>('8835a3d1-ed37-471f-84ab-da5eb177655e');

  onCustomerCreated($event: string): void {
    this.customerId.set($event);

    setTimeout(() => {
      this.activeIndex++;
    }, 1500);
  }

  get isCustomerCreated(): boolean {
    return !this.customerId();
  }
}
