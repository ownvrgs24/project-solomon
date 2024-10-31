import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../shared/directives/to-uppercase.directive';
import { HttpService } from '../../../../shared/services/http.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoanService } from '../../../../shared/services/loan.service';
import { StatusTagService } from '../../../../shared/services/status-tag.service';
import { firstValueFrom } from 'rxjs';

export interface Customer {
  recno: number
  customer_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension_name: string;
  gender: string;
  civil_status: string;
  mobile_number: string;
  telephone_number: string;
  email_address: string;
  client_picture: any;
  date_of_birth: any;
  client_status: string;
  cmk_status: string;
  date_marked_as_delinquent: any;
  created_at: string;
  updated_at: string;
  cx_address: CxAddress[];
}

export interface CxAddress {
  recno: number;
  address_id: string;
  customer_id: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  zip_code: string;
  complete_address: string;
  landmark: any;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Loan {
  customer_id: string;
  loan_id: string;
  loan_amount: number;
  loan_interest_rate: number;
  loan_mode_of_payment: string;
  loan_opening_date: Date;
  loan_closed_date: Date;
  loan_status: string;
  date_marked_as_delinquent: Date;
  loan_remarks: string;
  created_at: Date;
  updated_at: Date;
  cx_detail: Customer;
}

@Component({
  selector: 'app-loan-approval',
  standalone: true,
  imports: [
    TableModule,
    IconFieldModule,
    FormsModule,
    InputIconModule,
    InputTextModule,
    CommonModule,
    TagModule,
    UpperCaseInputDirective,
    ButtonModule,
    TooltipModule,
    RouterModule,
    AvatarModule,
    FieldsetModule
  ],
  templateUrl: './loan-approval.component.html',
  styleUrl: './loan-approval.component.scss'
})
export class LoanApprovalComponent {

  private readonly loanService = inject(LoanService);
  private readonly http = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);
  public readonly statusTagService = inject(StatusTagService);
  private readonly messageService = inject(MessageService);

  public searchValue!: string;
  public loading: boolean = true;
  public loans: Loan[] = [];

  ngOnInit(): void {
    this.getLoansOnReview();
  }

  private getLoansOnReview(): void {
    this.loading = true;
    this.loanService.getLoansForReview().subscribe({
      next: (res: any) => {
        this.loans = res.data as Loan[];
        this.loans.forEach((loan) => {
          (loan as any).fullname = `${loan.cx_detail.last_name || ''}, ${loan.cx_detail.first_name || ''} ${loan.cx_detail.middle_name || ''} ${loan.cx_detail.extension_name || ''}`;
          loan.cx_detail.client_picture =
            this.http.rootURL + '/' + loan.cx_detail.client_picture;
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  approveLoan(loan_id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this loan?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success p-button-outlined ',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: () => {
        this.loanService.approveLoan({ loan_id }).subscribe(() => {
          this.getLoansOnReview();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Loan approved successfully', life: 3000 });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Loan approval cancelled', life: 3000 });
      }
    });
  }

  approveAllLoans() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve all loans?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success p-button-outlined',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: () => {
        this.loading = true;
        const approvalPromises = this.loans.map(loan =>
          firstValueFrom(this.loanService.approveLoan({
            loan_id: loan.loan_id
          }))
        );

        Promise.all(approvalPromises)
          .then(() => {
            this.getLoansOnReview();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Loans approved successfully', life: 3000 });
          })
          .catch(err => {
            console.error('Failed to approve all loans:', err);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Loan approval cancelled', life: 3000 });
      }
    });
  }
}
