import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { LoanRepaymentAnalysis, TRANSACTION_STATUS } from '../../services/loan-computation.service';
import { AmortizationTable } from '../../amortization-table.component';
import { UtilsService } from '../../../../../../../shared/services/utils.service';
import { LoanComputationDateDifferenceService } from '../../services/loan-computation-date-difference.service';
import { ToastModule } from 'primeng/toast';

interface Capital {
  transaction_date: FormControl<Date | null>;
  capital: FormControl<number | null>;
  transaction_remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-capital',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyFilterModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    FieldsetModule,
    InputNumberModule,
    DividerModule,
    InputTextareaModule,
    UpperCaseInputDirective,
    ToastModule,
  ],
  templateUrl: './capital.component.html',
  styleUrl: './capital.component.scss',
})
export class CapitalComponent {
  private ref = inject(DynamicDialogRef);
  private readonly confirmationService = inject(ConfirmationService);
  public readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly utils = inject(UtilsService);
  private readonly messageService = inject(MessageService);
  private computeDateDifference = inject(LoanComputationDateDifferenceService);

  minDate: Date | undefined;
  maxDate: Date | undefined;

  capitalForm: FormGroup<Capital> = new FormGroup({
    transaction_date: new FormControl<Date | null>(new Date(), [
      Validators.required,
    ]),
    capital: new FormControl<number | null>(0, [Validators.required]),
    transaction_remarks: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    console.log(this.dialogConfig.data);
    this.minDate = this.transactionDateRange.startDate;
    this.maxDate = this.transactionDateRange.endDate;

    this.capitalForm.get('transaction_date')?.setValue(this.transactionDateRange.startDate);
  }

  removeDateRangeValidation() {
    this.minDate = undefined;
    this.maxDate = undefined;

    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Date range validation removed.',
      closable: true,
      life: 5000,
    })
  }

  refreshDateRangeValidation() {
    this.minDate = this.transactionDateRange.startDate;
    this.maxDate = this.transactionDateRange.endDate;
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Date range validation refreshed.',
      closable: true,
      life: 5000,
    })
  }

  submitCapitalForm() {
    const data: LoanRepaymentAnalysis & AmortizationTable = this.dialogConfig.data;

    const { capital } = this.capitalForm.value;
    const newBalance = data.transactions[data.selectedIndex].balance + (capital ?? 0);

    this.confirmationService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text secondary-button',
      acceptLabel: 'Yes',
      message: 'ARE YOU SURE YOU WANT TO SUBMIT THIS CAPITAL AMOUNTING TO ' + (this.utils.currencyFormatter(capital ?? 0)).toString().toUpperCase() + '?',
      accept: () => {
        this.ref?.close({
          balance: newBalance,
          ...this.capitalForm.value,
          transaction_status: TRANSACTION_STATUS.APPROVED,
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Capital successfully submitted! Please wait for the approval.',
          closable: true,
          life: 5000,
        });
      },
      reject: () => {
        console.log('Action Cancelled.');
      },
    });
  }

  get transactionDateRange(): {
    startDate: Date;
    endDate: Date;
  } {
    return {
      startDate: new Date(this.dialogConfig.data.transactions[this.dialogConfig.data.selectedIndex].transaction_date),
      endDate: this.computeDateDifference.getNextDueDate(
        this.dialogConfig.data.transactions[this.dialogConfig.data.selectedIndex].transaction_date,
        this.dialogConfig.data.loan_mode_of_payment
      ),
    }
  }
}
