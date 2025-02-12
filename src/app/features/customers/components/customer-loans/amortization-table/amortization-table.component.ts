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
import { LoanService } from '../../../../../shared/services/loan.service';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { CapitalComponent } from '../amortization-table/dialog/capital/capital.component';
import { PaymentsComponent } from '../amortization-table/dialog/payments/payments.component';
import { LoanComputationService, LoanRepaymentAnalysis, TRANSACTION_STATUS } from './services/loan-computation.service';
import { MODE_OF_PAYMENT } from './services/loan-computation-date-difference.service';
import { TransactionService } from '../../../../../shared/services/transaction.service';

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
  is_payment?: boolean;
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
    TooltipModule,
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
  private readonly dialogService = inject(DialogService);
  private readonly transactionService = inject(TransactionService);

  amortizationTable!: AmortizationTable[];
  customerData!: Customer;
  loanData!: PrincipalLoan;
  public loanRepaymentData: LoanRepaymentAnalysis = {
    interest: 0,
    selectedIndex: 0,
    loan_interest_rate: 0,
    days: 0,
    months: 0,
    isDelinquent: false,
    loan_mode_of_payment: MODE_OF_PAYMENT.BI_MONTHLY,
    find_upper_payment_bracket_index: 0,
    paid_in_advance: false,
  };

  ngOnInit(): void {
    this.fetchAmortizationData();
  }

  populateLoanInformation(data: any): void {
    this.amortizationTable = data.data.transactions;
    this.customerData = data.data.customer;
    this.loanData = data.data.loan;
  }

  /**
   * Fetches the amortization data for a loan and processes it.
   * 
   * This method retrieves the loan ID from the activated route's snapshot and uses the loan service to load the amortization table.
   * It subscribes to the response and handles the following:
   * - On success, it populates the loan information.
   * - On error, it displays an error message.
   * - On completion, it calculates the interest accumulation and checks if the loan is delinquent.
   * 
   * If the loan is delinquent, it displays a delinquent message and updates the loan status to delinquent by:
   * - Adjusting the transaction date based on the loan's mode of payment (monthly or bi-monthly).
   * - Calling the loan service to update the loan status and subscribing to the response to handle success and error messages.
   */
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
        this.loanRepaymentData = this.loanComputationService.calculateInterestAccumulation(
          this.amortizationTable as unknown as Transaction[],
          this.loanData as unknown as PrincipalLoan
        );

        console.log(this.loanRepaymentData);
    
        
        // Check if the loan is delinquent
        if (this.loanRepaymentData.isDelinquent) {
          this.messageService.add({
            severity: 'error',
            summary: 'Delinquent',
            detail: 'This loan is delinquent, please pay immediately!',
            closable: false,
          });

          let { transaction_date } = this.amortizationTable[this.loanRepaymentData.selectedIndex];

          transaction_date = new Date(transaction_date);

          if (this.loanRepaymentData.loan_mode_of_payment === MODE_OF_PAYMENT.MONTHLY) {
            // If the loan is monthly, add 30 days to the transaction date
            transaction_date.setDate(transaction_date.getDate() + 30);
          }

          if (this.loanRepaymentData.loan_mode_of_payment === MODE_OF_PAYMENT.BI_MONTHLY) {
            // If the loan is bi-monthly, add 15 days to the transaction date
            transaction_date.setDate(transaction_date.getDate() + 15);
          }

          // Update the loan status to delinquent
          this.loanService.updateLoanStatusToDelinquent({
            loan_id: this.loanData.loan_id,
            date_marked_as_delinquent: transaction_date,
          }).subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.message,
                life: 3000,
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
          });
        }
      }
    });
  }

  openPaymentDialog(): void {
    const ref: DynamicDialogRef = this.dialogService.open(PaymentsComponent, {
      header: 'Payment Due',
      data: {
        ...this.loanRepaymentData,
        transactions: this.amortizationTable as unknown as Transaction[],
      },
      width: '50%',
      styleClass: 'dialog',
      draggable: true,
      closeOnEscape: true,
    });

    ref.onClose.subscribe((data: Transaction) => {
      if (data) {
        this.transactionService.submitTransaction(
          {
            ...data,
            loan_id: this.loanData.loan_id,
            transaction_status: TRANSACTION_STATUS.APPROVED,
            is_payment: true,
          }
        ).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.amortizationTable.push(response.data);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
      }
    });
  }

  openCapitalDialog(): void {
    const ref: DynamicDialogRef = this.dialogService.open(CapitalComponent, {
      header: 'Add Capital',
      data: {
        ...this.loanRepaymentData,
        transactions: this.amortizationTable as unknown as Transaction[],
      },
      width: '50%',
      styleClass: 'dialog',
      draggable: true,
      closeOnEscape: true,
    });

    ref.onClose.subscribe((data: Transaction) => {
      if (data) {
        this.transactionService.submitTransaction({
          ...data,
          loan_id: this.loanData.loan_id,
        }).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });

            this.amortizationTable.push(response.data);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        })
      }
    });
  }
}
