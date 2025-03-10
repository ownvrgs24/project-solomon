import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../../../../shared/services/loan.service';
import { CustomerLoanOverview, Customer, PrincipalLoan, Transaction } from '../amortization-table/amortization-table.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableEditCancelEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { StatusTagService } from '../../../../../shared/services/status-tag.service';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { TransactionService } from '../../../../../shared/services/transaction.service';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-edit-amortization-table',
  standalone: true,
  imports: [
    FieldsetModule,
    AvatarModule,
    CommonModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    TagModule,
    ChipModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    CalendarModule,
    MessagesModule,
    RadioButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-amortization-table.component.html',
  styleUrl: './edit-amortization-table.component.scss',
  providers: [MessageService],
})
export class EditAmortizationTableComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly loanService = inject(LoanService);
  private readonly messageService = inject(MessageService);
  private readonly transactionService = inject(TransactionService);
  private readonly confirmService = inject(ConfirmationService);
  public readonly statusTagService = inject(StatusTagService);

  amortizationTable!: CustomerLoanOverview[];
  clonedAmortizationTable!: CustomerLoanOverview[];
  customerData!: Customer;
  loanData!: PrincipalLoan;

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.getAmortizationTable();
  }

  public customerInterestRates = [
    { key: '0', label: '6%', value: 6 },
    { key: '1', label: '8%', value: 8 }
  ];

  handleCustomerInterestOnChange($event: any) {
    this.loanService.updateLoan({
      loan_id: this.loanData.loan_id,
      loan_interest_rate: $event,
    }).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        this.loanData = response.data;
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

  getAmortizationTable() {
    const loanId = this.activatedRoute.snapshot.paramMap.get('loan_id');

    this.loanService.loadAmortizationTable({ loan_id: loanId })
      .subscribe({
        next: (response: any) => {
          this.amortizationTable = this.mapTransactionDates(response.data.transactions);
          this.clonedAmortizationTable = JSON.parse(JSON.stringify(this.amortizationTable)); // Deep copy
          this.customerData = response.data.customer;
          this.loanData = response.data.loan;

          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Note: Editing of transactions will not auto compute data.',
            closable: false,
          });

          this.formGroup = new FormGroup({
            selectedInterestRate: new FormControl(this.loanData.loan_interest_rate),
          });

        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        complete: () => { },
      });
  }

  mapTransactionDates(transactions: any): CustomerLoanOverview[] {
    return transactions.map((item: any) => ({
      ...item,
      transaction_date: new Date(item.transaction_date) || null
    }));
  }

  onEditComplete(event: any) {
    this.confirmService.confirm({
      header: 'Overwrite Transaction',
      message: 'Are you sure you want to overwrite this transaction?',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancel',
      acceptLabel: 'Overwrite',
      accept: () => {
        const updatedData = {
          [event.field]: event.data,
          transaction_id: (this.amortizationTable as any)[event.index].transaction_id
        };
        this.transactionService.updateTransaction(updatedData).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            (this.amortizationTable as any)[event.index] = response.data;
            // Update the cloned table to reflect the committed changes
            this.clonedAmortizationTable[event.index] = { ...response.data };
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        })
      },
      reject: () => {
        // Restore the previous value from the cloned table
        (this.amortizationTable as any)[event.index] = { ...this.clonedAmortizationTable[event.index] };
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Edit has been cancelled and previous value restored'
        });
      }
    });
  }

  onEditCancel(event: TableEditCancelEvent) {
    // Check if index exists and is valid
    if (event.index === undefined || event.index === null) return;

    // Restore the previous value from the cloned table
    (this.amortizationTable as any)[event.index] = { ...this.clonedAmortizationTable[event.index] };

    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Edit has been cancelled and previous value restored'
    });
  }
}
