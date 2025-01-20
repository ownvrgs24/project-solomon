import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { LoanInterestCalculatorService } from '../../../../../shared/services/computations/loan-interest-calculator.service';
import { LoanService } from '../../../../../shared/services/loan.service';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { CapitalComponent } from '../amortization-table/dialog/capital/capital.component';
import { PaymentsComponent } from '../amortization-table/dialog/payments/payments.component';
import { LoanComputationService } from './services/loan-computation.service';

export interface AmortizationTable {
  customer: Customer;
  loan: PrincipalLoan;
  transactions: Transaction[];
  transaction_date: Date;
}

export interface Customer {
  fullname: string;
  customer_id: string;
}

export interface PrincipalLoan {
  loan_id: string;
  loan_mode_of_payment: string;
  loan_interest_rate: number;
  principal_loan_amount: number;
}

export interface Transaction {
  transaction_date: Date;
  balance: number;
  payment: number;
  capital: number;
  transaction_status: string;
  transaction_id: string;
  recno?: number;
  loan_id?: string;
  transaction_or_number?: number;
  balance_interest?: number;
  loan_status: string;
  interest?: number;
  collection?: number;
  change?: number;
  is_interest_applied?: boolean;
  is_deleted?: boolean;
  transaction_remarks?: string;
  created_at?: string;
  updated_at?: string;
}
[];

export interface ActualInterestData {
  interest: number;
  selectedIndex: number;
  interestRate: number;
  message: string;
  balanceInterest: number;
  nextPaymentDate?: Date;
}

@Component({
  selector: 'app-amortization-table',
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
    ToastModule,
  ],
  templateUrl: './amortization-table.component.html',
  styleUrl: './amortization-table.component.scss',
  providers: [MessageService, DialogService],
})
export class AmortizationTableComponent implements OnInit {

  public readonly statusTagService = inject(StatusTagService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loanService = inject(LoanService);
  private readonly messageService = inject(MessageService);
  private readonly loanComputationService = inject(LoanComputationService);

  amortizationTable!: AmortizationTable[];
  customerData!: Customer;
  loanData!: PrincipalLoan;

  ngOnInit(): void {
    this.fetchAmortizationData();
  }

  populateLoanInformation(data: any): void {
    this.amortizationTable = data.data.transactions;
    this.customerData = data.data.customer;
    this.loanData = data.data.loan;
  }

  fetchAmortizationData() {
    const loanId = this.activatedRoute.snapshot.paramMap.get('loan_id');
    this.loanService.loadAmortizationTable({ loan_id: loanId }).subscribe({
      next: (response: any) => {
        this.populateLoanInformation(response);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      complete: () => {
        this.calculateInterestAccumulation(this.amortizationTable as unknown as Transaction[], this.loanData as unknown as PrincipalLoan);
      }
    });
  }

  private calculateInterestAccumulation(transaction: Transaction[], loanData: PrincipalLoan): void {
    this.loanComputationService.calculateInterestAccumulation(transaction, loanData);
  }
}
