import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoanService } from '../../../../../shared/services/loan.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Messages, MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';

export interface CustomerLoanRecord {
  recno: number;
  customer_id: string;
  loan_id: string;
  loan_amount: number;
  loan_interest_rate: number;
  loan_mode_of_payment: string;
  loan_opening_date: string;
  loan_closed_date: any;
  loan_status: string;
  date_marked_as_delinquent: any;
  loan_remarks: string;
  created_at: string;
  updated_at: string;
  cxl_transaction: any[];
  cx_detail: {
    client_status: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    extension_name: string;
  };
  fullname: string;
}
[];

@Component({
  selector: 'app-loan-records',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    MessagesModule,
    FieldsetModule,
    AvatarModule
  ],
  templateUrl: './loan-records.component.html',
  styleUrl: './loan-records.component.scss',
  providers: [MessageService],
})
export class LoanRecordsComponent implements OnInit {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly loanService = inject(LoanService);
  public readonly statusTagService = inject(StatusTagService);
  readonly messageService = inject(MessageService);

  customerLoanRecords: CustomerLoanRecord[] = [];

  ngOnInit(): void {
    this.getCustomerLoanRecords();
  }

  getCustomerLoanRecords() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loanService
      .loadCustomerLoans({
        customer_id: id,
      })
      .subscribe({
        next: (response: any) => {
          this.customerLoanRecords = response.data;
          if (this.customerLoanRecords.length === 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'No loan records are available',
              closable: false,
            });
            return;
          }

          this.customerLoanRecords = this.customerLoanRecords.map((loan) => ({
            ...loan,
            fullname: `${loan.cx_detail.last_name || ''}, ${loan.cx_detail.first_name || ''} ${loan.cx_detail.middle_name || ''} ${loan.cx_detail.extension_name || ''}`.trim()
          }))

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
            closable: true,
            life: 3000,
          });

          const forReviewLoans = this.customerLoanRecords.filter(
            (loan) => loan.loan_status === 'FOR_REVIEW'
          );

          if (forReviewLoans.length > 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'For Review',
              detail: 'Some loans are currently under review. Please wait for approval. Thank you.',
              closable: false,
            });
          }
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load customer loan records',
          });
        },
      });
  }

  get customerId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }
}
