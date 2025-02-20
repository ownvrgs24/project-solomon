import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpService } from '../../../../../shared/services/http.service';
import { DividerModule } from 'primeng/divider';
import { UtilsService } from '../../../../../shared/services/utils.service';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { UserService } from '../../../../../shared/services/user.service';

export interface AmortizationTable {
  balance: number;
  payment: number;
  capital: number;
  transaction_status: string;
  customer: Customer;
  loan: PrincipalLoan;
  transactions: Transaction[];
  transaction_date: Date;
  transaction_id: string;
}

export interface Customer {
  fullname: string;
  customer_id: string;
  gender: string;
  civil_status: string;
  mobile_number: string;
  telephone_number: string;
  email_address: string;
  client_picture: string;
}

export interface PrincipalLoan {
  loan_id: string;
  loan_mode_of_payment: string;
  loan_interest_rate: number;
  principal_loan_amount: number;
  loan_status: string;
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
    ConfirmDialogModule,
    DividerModule,
    BlockUIModule,
    PanelModule,
  ],
  templateUrl: './amortization-table.component.html',
  styleUrl: './amortization-table.component.scss',
  providers: [MessageService, DialogService, ConfirmationService],
})
export class AmortizationTableComponent implements OnInit {

  public readonly statusTagService = inject(StatusTagService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loanService = inject(LoanService);
  private readonly messageService = inject(MessageService);
  private readonly loanComputationService = inject(LoanComputationService);
  private readonly dialogService = inject(DialogService);
  private readonly transactionService = inject(TransactionService);
  private readonly confirmDialogService = inject(ConfirmationService);
  private readonly http = inject(HttpService);
  public readonly utils = inject(UtilsService)
  private readonly user = inject(UserService);

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
    this.customerData = data.data.customer = {
      ...data.data.customer,
      client_picture: `${this.http.rootURL}/${data.data.customer.client_picture}`
    };
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

        // Check if the loan is delinquent
        if (this.loanRepaymentData.isDelinquent) {

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
            customer_id: this.customerData.customer_id,
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
            complete: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Delinquent',
                detail: 'This Loan Account is delinquent, please pay immediately!',
                closable: true,
                life: 5000,
              });
            }
          });
        }
      }
    });
  }

  /**
   * Opens a payment dialog for processing loan payments.
   * 
   * This method uses the `dialogService` to open a dialog with the `PaymentsComponent`.
   * The dialog is configured with various options such as header, data, width, style, 
   * and behavior on escape key press.
   * 
   * When the dialog is closed, if a transaction data is returned, it submits the transaction 
   * using the `transactionService`. Upon successful submission, it updates the amortization 
   * table and displays a success message. If an error occurs during submission, an error 
   * message is displayed.
   * 
   * After the transaction is processed, it calculates the total approved payments and checks 
   * if the total approved payments are greater than or equal to the balance. If so, it calls 
   * the `confirmLoanPaymentCompletion` method.
   * 
   * @returns {void}
   */
  openPaymentDialog(): void {
    const ref: DynamicDialogRef = this.dialogService.open(PaymentsComponent, {
      header: 'Payment',
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
          complete: () => {
            const confirmedLoanRecords = this.amortizationTable as unknown as Transaction[];
            const totalApprovedPayments = confirmedLoanRecords.reduce((acc, curr) => {
              if (curr.transaction_status === TRANSACTION_STATUS.APPROVED) {
                acc += curr.payment || 0;
              }
              return acc;
            }, 0);
            const { balance } = this.amortizationTable[this.amortizationTable.length - 1];
            // Check if the total approved payments are greater than or equal to the balance
            if (totalApprovedPayments >= balance) {
              this.updateLoanPaymentStatus(); //  Update the loan payment status to PAID
            }
          }
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

  revokeTransaction(index: number): void {
    this.confirmDialogService.confirm({
      message: 'Are you sure you want to delete this transaction?',
      header: 'Confirmation of Transaction Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        const { transaction_id } = this.amortizationTable[index];
        this.transactionService.deleteTransaction(transaction_id).subscribe({
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
        });
      },
      reject: () => {
        // Add message if the user rejects the confirmation dialog
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Transaction deletion cancelled',
        });
      },
    });
  }

  updateLoanPaymentStatus(): void {
    this.loanService.updateLoanStatusToPaid({ loan_id: this.loanData.loan_id })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The system has automatically marked this loan as PAID. Thank you!',
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
          this.fetchAmortizationData();
        }
      });
  }

  get isTransactionPermitted(): boolean {
    return this.user.getUserRole() !== 'ENCODER';
  }
}
