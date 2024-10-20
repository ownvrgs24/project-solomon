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
import { AmmortizationTableComponent } from '../../ammortization-table.component';

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
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  public readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly utilityService = inject(UtilsService);
  private ref = inject(DynamicDialogRef);

  paymentsForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const { interest } = this.dialogConfig.data;

    const computed_interest =
      (interest?.balanceInterest || 0) + (interest?.interest || 0);

    const paymentsDialog: PaymentsDialog = {
      transaction_date: new FormControl(new Date(interest.nextPaymentDate), [
        Validators.required,
      ]),
      transaction_or_number: new FormControl(null),
      interest: new FormControl(computed_interest, [Validators.required]),
      balance_interest: new FormControl(0, [Validators.required]),
      payment: new FormControl(0, [Validators.required]),
      change: new FormControl(0, [Validators.required]),
      collection: new FormControl(0, [Validators.required]),
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
        (interest?.balanceInterest || 0) + (interest?.interest || 0);
      this.paymentsForm.get('interest')?.setValue(computed_interest);
    }
  }

  validateCollection() {
    // console.log(transactions[interest.interest.selectedIndex].transaction_date);
    const { interest, collection } = this.paymentsForm.value;
    // FORMULA: balance_interest = interest - collection
    if (collection < interest) {
      const balance_interest = interest - collection;
      this.paymentsForm.get('balance_interest')?.setValue(balance_interest);
    } else {
      const { interest } = this.dialogConfig.data;
      this.paymentsForm.get('balance_interest')?.setValue(0);
      this.paymentsForm
        .get('transaction_date')
        ?.setValue(new Date(interest.nextPaymentDate));
      this.paymentsForm.get('transaction_date')?.enable();
    }

    const isCollectionValid =
      collection !== null &&
      this.paymentsForm.get('collection')?.valid &&
      (collection ?? 0) > (interest ?? 0);

    if (isCollectionValid) {
      this.paymentsForm.get('payment')?.enable();
      this.paymentsForm
        .get('payment')
        ?.setValue((collection ?? 0) - (interest ?? 0));
    } else {
      this.paymentsForm.get('payment')?.disable();
      this.paymentsForm.get('payment')?.setValue(0);
    }

    // Assuming change should be reset to 0 when collection is invalid
    this.paymentsForm.get('change')?.setValue(0);
  }

  payDueObligation() {
    const { balance_interest, payment } = this.paymentsForm.getRawValue();
    const { transactions, interest } = this.dialogConfig.data;
    const selectedIndex = interest.selectedIndex;

    if (balance_interest > 0) {
      this.hasBalanceInterest(
        balance_interest,
        transactions[selectedIndex].balance
      );
    } else {
      const latestBalance: number =
        transactions[selectedIndex].balance - payment;
      const transaction = {
        ...this.paymentsForm.value,
        balance: latestBalance,
        transaction_status: 'FOR_REVIEW',
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
          transaction_status: 'FOR_REVIEW',
        });
      },
      reject: () => {
        console.log('Payment cancelled');
      },
    });
  }
}
