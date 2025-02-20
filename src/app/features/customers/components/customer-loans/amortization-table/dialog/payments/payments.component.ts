import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilsService } from '../../../../../../../shared/services/utils.service';
import { LoanComputationDateDifferenceService } from '../../services/loan-computation-date-difference.service';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';

interface PaymentsDialog {
  transaction_date: FormControl<Date | null>;
  transaction_or_number: FormControl<number | null>;
  interest: FormControl<number | null>;
  balance_interest: FormControl<number | null>;
  payment: FormControl<number | null>;
  change: FormControl<number | null>;
  collection: FormControl<number | null>;
  is_interest_applied: FormControl<boolean | null>;
  transaction_remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    CalendarModule,
    InputTextareaModule,
    FieldsetModule,
    KeyFilterModule,
    InputNumberModule,
    DividerModule,
    UpperCaseInputDirective,
    TooltipModule,
    RadioButtonModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {

  public readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly utilityService = inject(UtilsService);
  private ref = inject(DynamicDialogRef);
  private computeDateDifference = inject(LoanComputationDateDifferenceService);
  private messageService = inject(MessageService);


  paymentsForm: FormGroup = new FormGroup({});
  minDate: Date | undefined;
  maxDate: Date | undefined;



  ngOnInit(): void {
    this.initializeForm();

    this.minDate = this.transactionDateRange.startDate;
    this.maxDate = this.transactionDateRange.endDate;

    this.paymentsForm.get('transaction_date')?.setValue(this.transactionDateRange.endDate);

    const { balance_interest } = this.dialogConfig.data.transactions[this.dialogConfig.data.find_upper_payment_bracket_index];

    if (balance_interest > 0) {
      this.paymentsForm.get('interest')?.setValue(
        this.dialogConfig.data.interest + this.dialogConfig.data.transactions[this.dialogConfig.data.selectedIndex].balance_interest
      );
    }


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

  get transactionDateRange(): {
    startDate: Date;
    endDate: Date;
  } {
    // Check the customer is delinquent
    if (this.dialogConfig.data.isDelinquent) {
      return {
        startDate: new Date(this.dialogConfig.data.transactions[this.dialogConfig.data.selectedIndex].transaction_date),
        endDate: new Date(),
      }
    }

    return {
      startDate: new Date(this.dialogConfig.data.transactions[this.dialogConfig.data.selectedIndex].transaction_date),
      endDate: this.computeDateDifference.getNextDueDate(
        this.dialogConfig.data.transactions[this.dialogConfig.data.find_upper_payment_bracket_index].transaction_date,
        this.dialogConfig.data.loan_mode_of_payment
      ),
    }
  }

  initializeForm(): void {
    const { interest } = this.dialogConfig.data;

    const computed_interest = (interest?.balanceInterest || 0) + (interest || 0);

    const paymentsDialog: PaymentsDialog = {
      transaction_date: new FormControl(
        new Date(interest?.nextPaymentDate || new Date()),
        [Validators.required]
      ),
      transaction_or_number: new FormControl(null),
      interest: new FormControl(computed_interest, [Validators.required]),
      balance_interest: new FormControl(null, [Validators.required]),
      payment: new FormControl(null, [Validators.required]),
      change: new FormControl(null, [Validators.required]),
      collection: new FormControl(null, [Validators.required]),
      is_interest_applied: new FormControl(true, [Validators.required]),
      transaction_remarks: new FormControl(''),
    };

    this.paymentsForm = new FormGroup(paymentsDialog);
  }

  computeChange() {
    const { payment, interest, collection } = this.paymentsForm.value;
    const change = (collection ?? 0) - ((payment ?? 0) + (interest ?? 0));
    this.paymentsForm.get('change')?.setValue(change);
  }

  handleInterestChange(event: CheckboxChangeEvent) {
    if (!event.checked) {
      this.paymentsForm.get('interest')?.setValue(0);
    } else {
      const { interest } = this.dialogConfig.data;
      const computed_interest =
        (interest?.balanceInterest || 0) + (interest || 0);
      this.paymentsForm.get('interest')?.setValue(computed_interest);
    }
  }



  validateCollection() {
    const { interest, collection } = this.paymentsForm.value;
    // FORMULA: balance_interest = interest - collection
    if (collection < interest) {
      const balance_interest = interest - collection;
      this.paymentsForm.get('balance_interest')?.setValue(balance_interest);
    } else {
      this.paymentsForm.get('balance_interest')?.setValue(0);
    }

    const isCollectionValid = collection !== null && this.paymentsForm.get('collection')?.valid && (collection ?? 0) > (interest ?? 0);

    if (isCollectionValid) {
      this.paymentsForm.get('payment')?.enable();
      this.paymentsForm.get('payment')?.setValue((collection ?? 0) - (interest ?? 0));
    } else {
      this.paymentsForm.get('payment')?.disable();
      this.paymentsForm.get('payment')?.setValue(0);
    }

    // Assuming change should be reset to 0 when collection is invalid
    this.paymentsForm.get('change')?.setValue(0);
  }

  payDueObligation() {
    const { balance_interest, payment } = this.paymentsForm.getRawValue();
    const { transactions, selectedIndex } = this.dialogConfig.data;

    if (balance_interest > 0) {
      this.hasBalanceInterest(balance_interest, transactions[selectedIndex].balance);
    } else {
      const latestBalance: number = transactions[selectedIndex].balance - payment;
      const transaction = {
        ...this.paymentsForm.value,
        balance: latestBalance,
        transaction_status: 'APPROVED',
        is_payment: true,
      };
      this.ref.close(transaction);
    }
  }

  hasBalanceInterest(balance_interest: number, balance: number) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Confirm',
      message: `You currently have ${this.utilityService.currencyFormatter(
        balance_interest
      )} in balance interest. Please confirm your transaction before proceeding.`,
      accept: () => {
        this.ref.close({
          ...this.paymentsForm.getRawValue(),
          balance: balance,
          interest: this.paymentsForm.get('collection')?.value,
          transaction_status: 'APPROVED',
        });
      },
      reject: () => {
        console.log('Payment cancelled');
      },
    });
  }
}
