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
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';

interface PaymentsDialog {
  transaction_date: FormControl<Date | null>;
  transaction_or_number: FormControl<number | null>;
  interest: FormControl<number | null>;
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

  paymentsForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const { transactions, customer, loan, interest } = this.dialogConfig.data;

    console.log(this.dialogConfig.data);

    const paymentsDialog: PaymentsDialog = {
      transaction_date: new FormControl(new Date(), [Validators.required]),
      transaction_or_number: new FormControl(0, [Validators.required]),
      interest: new FormControl(interest.interest, [Validators.required]),
      payment: new FormControl(null, [Validators.required]),
      change: new FormControl(null, [Validators.required]),
      collection: new FormControl(null, [Validators.required]),
      is_interest_applied: new FormControl(true, [Validators.required]),
      transaction_remarks: new FormControl(null),
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
      const interest = this.dialogConfig.data?.interest.interest || 0;
      this.paymentsForm.get('interest')?.setValue(interest);
    }
  }

  validateCollection() {
    const { interest, collection } = this.paymentsForm.value;

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

    // TODO: if the value of the payment is greater than the collection, the change will be the remaining sum of the payment
    // FORMULA: change = payment - (collection - interest)
  }

  payDueObligation() {
    console.log(this.paymentsForm.value);
    // TODO: Implement payment logic here and close the dialog
  }
}
