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
  readonly activatedRoute = inject(ActivatedRoute);
  readonly loanService = inject(LoanService);
  readonly messageService = inject(MessageService);
  private readonly loanInterestCalculator = inject(
    LoanInterestCalculatorService
  );
  public readonly statusTagService = inject(StatusTagService);
  public readonly dialogService = inject(DialogService);
  private transactionService = inject(TransactionService);

  amortizationTable!: AmortizationTable[];
  customerData!: Customer;
  loanData!: PrincipalLoan;

  currentDate: Date = new Date();

  ref: DynamicDialogRef | undefined;

  actualInterestData: ActualInterestData = {
    interest: 0,
    selectedIndex: 0,
    interestRate: 0,
    message: '',
    balanceInterest: 0,
  };

  ngOnInit(): void {
    this.getAmortizationTable();
  }

  calculateNextDueInterest() {
    // this.actualInterestData =
    //   this.loanInterestCalculator.computeNextProjectedInterest(
    //     this.loanData,
    //     this.amortizationTable as unknown as Transaction[]
    //   );

    // this.messageService.add({
    //   severity: 'info',
    //   summary: 'Next Due Interest',
    //   detail: `Next Due Date is ${this.actualInterestData.nextPaymentDate?.toDateString()} with an interest of ${this.actualInterestData.interest}`,
    // });
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
        this.loanInterestCalculator.computeLoanInterest(
          this.loanData,
          this.amortizationTable as unknown as Transaction[]
        );
      },
    });
  }

  payDueObligation() {
    this.ref = this.dialogService.open(PaymentsComponent, {
      header: 'PAY DUE OBLIGATION',
      width: '40%',
      draggable: true,
      data: {
        customer: this.customerData,
        loan: this.loanData,
        transactions: this.amortizationTable,
        interest: this.actualInterestData,
      },
    });

    this.ref.onClose.subscribe((data: AmortizationTable) => {
      if (data) {
        this.transactionService
          .submitTransaction({
            ...data,
            loan_id: this.loanData.loan_id,
            transaction_status: 'APPROVED',
          })
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
            complete: () => {
              this.amortizationTable.push(data);
            },
          });
      }
    });
  }

  addCapital() {
    this.ref = this.dialogService.open(CapitalComponent, {
      header: 'ADD CAPITAL',
      width: '40%',
      draggable: true,
      data: {
        customer: this.customerData,
        loan: this.loanData,
        transactions: this.amortizationTable,
        interest: this.actualInterestData,
      },
    });

    this.ref.onClose.subscribe((data: AmortizationTable) => {
      if (data) {
        this.transactionService
          .submitTransaction({
            ...data,
            loan_id: this.loanData.loan_id,
          })
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
            complete: () => {
              this.amortizationTable.push(data);
            },
          });
      }
    });
  }
}
