import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoanService } from '../../../../../shared/services/loan.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

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
              summary: 'No records found',
              closable: false,
            });
            return;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
            closable: false,
          });
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
}
