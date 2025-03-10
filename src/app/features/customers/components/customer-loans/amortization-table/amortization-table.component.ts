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
import { EntryComponent } from './dialog/entry/entry.component';

export interface CustomerLoanOverview {
  customer: Customer;
  loan: PrincipalLoan;
  transactions: Transaction[];
}

export interface Customer {
  fullname: string;
  customer_id: string;
  gender: string;
  civil_status: string;
  mobile_number: string;
  telephone_number: string;
  email_address: string | null;
  client_picture?: string | null;
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
  interest: number;
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

  // Dependencies Injection for the component
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loanService = inject(LoanService);
  private readonly transactionService = inject(TransactionService);
  private readonly dialogService = inject(DialogService);
  private readonly http = inject(HttpService);
  public statusTagService = inject(StatusTagService);

  // Local Variables for the component
  public transactionTable: Transaction[] = [];
  public customerLoanProfile: Customer = {} as Customer;
  public principalLoanDetails: PrincipalLoan = {} as PrincipalLoan;
  public customerLoanDetails: CustomerLoanOverview = {} as CustomerLoanOverview;

  ngOnInit(): void {
    this.getAmortizationTable(); // Load the amortization table data
  }

  getAmortizationTable(): void {
    const loan_id = this.activatedRoute.snapshot.paramMap.get('loan_id');
    this.loanService.loadAmortizationTable({
      loan_id: loan_id,
    })
      .subscribe({
        next: (response: any) => {
          this.loadLoanData(response.data);
        },
        error: (error) => {
          console.error(error);
        },
      })
  }


  addEntry() {
    this.dialogService.open(EntryComponent, {
      header: 'Add Entry',
      draggable: true,
      height: 'auto',
      width: '35%',
      baseZIndex: 10000,
      resizable: true,
      data: this.customerLoanDetails,
    }).onClose.subscribe((data) => {
      if (data) {
        this.transactionService.submitTransaction({
          ...data,
          loan_id: this.customerLoanDetails.loan.loan_id,
        }).subscribe({
          next: () => {
            this.getAmortizationTable();
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
  }

  /**
   * Loads loan data into the component.
   *
   * @param data - The amortization table data containing transactions, customer, and loan information.
   * @param data.transactions - The list of transactions related to the loan.
   * @param data.customer - The customer information associated with the loan.
   * @param data.customer.client_picture - The URL or path to the customer's picture.
   * @param data.loan - The loan details.
   */
  loadLoanData(data: CustomerLoanOverview): void {
    const { transactions, customer, loan } = data;
    this.transactionTable = transactions;
    this.customerLoanProfile = {
      ...customer,
      client_picture: `${this.http.rootURL}/${customer.client_picture}` || null
    };
    this.principalLoanDetails = {
      ...loan,
      loan_mode_of_payment: loan.loan_mode_of_payment.replace(/_/g, ' '),
    };
    this.customerLoanDetails = data;
  }

  addCapital() {
    this.dialogService.open(CapitalComponent, {
      header: 'Add Capital',
      draggable: true,
      height: 'auto',
      width: '35%',
      baseZIndex: 10000,
      resizable: true,
      data: this.customerLoanDetails,
    }).onClose.subscribe((data) => {
      if (data) {
        this.transactionService.submitTransaction({
          ...data,
          loan_id: this.customerLoanDetails.loan.loan_id,
        }).subscribe({
          next: () => {
            this.getAmortizationTable();
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
  }


}
