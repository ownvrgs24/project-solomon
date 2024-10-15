import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoanService } from '../../../../../shared/services/loan.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { LoanInterestCalculatorService } from '../../../../../shared/services/loan-interest-calculator.service';

export interface AmortizationTable {
  customer: Customer;
  loan: Loan;
  transactions: Transaction[];
}

export interface Customer {
  fullname: string;
  customer_id: string;
}

export interface Loan {
  loan_id: string;
  loan_mode_of_payment: string;
  loan_interest_rate: number;
  principal_loan_amount: number;
}

export interface Transaction {
  transaction_date: string;
  balance: number;
  transaction_status: string;
  transaction_id: string;
  recno?: number;
  loan_id?: string;
  transaction_or_number?: number;
  balance_interest?: number;
  interest?: number;
  payment?: number;
  capital?: number;
  collection?: number;
  change?: number;
  is_interest_applied?: boolean;
  is_deleted?: boolean;
  transaction_remarks?: string;
  created_at?: string;
  updated_at?: string;
}
[];

@Component({
  selector: 'app-ammortization-table',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    MessagesModule,
    ChipModule,
    TagModule,
    TooltipModule,
    FieldsetModule,
    AvatarModule,
  ],
  templateUrl: './ammortization-table.component.html',
  styleUrl: './ammortization-table.component.scss',
  providers: [MessageService],
})
export class AmmortizationTableComponent implements OnInit {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly loanService = inject(LoanService);
  readonly messageService = inject(MessageService);
  private readonly loanInterestCalculatorService = inject(
    LoanInterestCalculatorService
  );
  public readonly statusTagService = inject(StatusTagService);

  amortizationTable!: AmortizationTable[];
  customerData!: Customer;
  loanData!: Loan;

  actualInterestData: {
    interest: number;
    selectedIndex: number;
    interestRate: number;
    message: string;
  } = {
    interest: 0,
    selectedIndex: 0,
    interestRate: 0,
    message: '',
  };

  ngOnInit(): void {
    this.getAmortizationTable();
  }

  getAmortizationTable() {
    const loanId = this.activatedRoute.snapshot.paramMap.get('loan_id');
    this.loanService.loadAmortizationTable({ loan_id: loanId }).subscribe({
      next: (response: any) => {
        this.amortizationTable = response.data.transactions;
        this.customerData = response.data.customer;
        this.loanData = response.data.loan;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      complete: () => {
        this.actualInterestData =
          this.loanInterestCalculatorService.calculateInterest(
            this.loanData,
            this.amortizationTable as unknown as Transaction[]
          );
      },
    });
  }
}
