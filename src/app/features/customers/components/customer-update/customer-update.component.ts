import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PersonalInformationFormComponent } from '../customer-create/forms/personal-information-form/personal-information-form.component';
import { PrincipalLoanComponent } from '../customer-create/forms/principal-loan/principal-loan.component';
import { AddressFormComponent } from '../customer-create/forms/address-form/address-form.component';
import { ShellCollateralsFormComponent } from '../customer-create/forms/collaterals/shell-collaterals-form.component';
import { ShellSourceOfIncomeComponent } from '../customer-create/forms/source-of-income/shell-source-of-income.component';
import { ShellCoMakerComponent } from '../customer-create/forms/co-maker/shell-co-maker.component';
import { ProfilePictureFormComponent } from '../customer-create/forms/profile-picture-form/profile-picture-form.component';
import { PromissoryNoteComponent } from '../customer-create/forms/promissory-note/promissory-note.component';
import { ArchivesComponent } from '../customer-create/forms/archives/archives.component';
import { DelinquentStatusComponent } from '../customer-create/forms/delinquent-status/delinquent-status.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { CustomersService } from '../../../../shared/services/customers.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-customer-update',
  standalone: true,
  imports: [
    PersonalInformationFormComponent,
    PrincipalLoanComponent,
    AddressFormComponent,
    ShellCollateralsFormComponent,
    ShellSourceOfIncomeComponent,
    ShellCoMakerComponent,
    ProfilePictureFormComponent,
    PromissoryNoteComponent,
    ArchivesComponent,
    DelinquentStatusComponent,
    ButtonModule,
    TabViewModule,
    CardModule,
    CommonModule,
  ],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.scss',
})
export class CustomerUpdateComponent implements OnInit, OnDestroy {


  private readonly customerService = inject(CustomersService);
  readonly activatedRoute = inject(ActivatedRoute);
  private readonly messagesService = inject(MessageService);
  private readonly userService = inject(UserService);

  customerData: any[] = [];

  ngOnInit(): void {
    this.fetchCustomerData();
  }

  fetchCustomerData() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.customerService.fetchCustomerById(id as string).subscribe({
      next: (data: any) => {
        this.customerData = data;
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer data fetched successfully',
        });
      },
      error: (error) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  activeIndexOnChange(event: number) {
    this.userService.setLocalStorage('activeIndex', event);
  }

  get activeIndex(): number {
    return this.userService.getLocalStorage('activeIndex') as number;
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.userService.removeLocalStorage('activeIndex');
  }
}
