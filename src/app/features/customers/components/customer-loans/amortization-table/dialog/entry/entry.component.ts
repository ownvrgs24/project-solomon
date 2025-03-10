import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoanComputationService, TRANSACTION_STATUS } from '../../services/loan-computation.service';
import { CustomerLoanOverview } from '../../amortization-table.component';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';

export interface EntryForm {
  transaction_date: FormControl<Date | null>;
  transaction_or_number: FormControl<number | null>;
  required_collection: FormControl<number | null>;
  balance_interest: FormControl<number | null>;
  interest: FormControl<number | null>;
  payment: FormControl<number | null>;
  balance: FormControl<number | null>;
  change: FormControl<number | null>;
  collection: FormControl<number | null>;
  is_interest_applied: FormControl<boolean | null>;
  transaction_remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    CalendarModule,
    InputNumberModule,
    DividerModule,
    CheckboxModule,
    InputTextareaModule,
    UpperCaseInputDirective
  ],
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {
  public readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  protected readonly computeService = inject(LoanComputationService);
  private readonly loanData = this.dialogConfig.data as CustomerLoanOverview;

  maxDate: Date = new Date();

  entryForm: FormGroup<EntryForm> = new FormGroup<EntryForm>({
    transaction_date: new FormControl<Date | null>(null, [Validators.required]),
    collection: new FormControl<number | null>(null, [Validators.required, this.validateCollection]),
    required_collection: new FormControl<number | null>(null, [Validators.required]),
    payment: new FormControl<number | null>(null, [Validators.required]),
    interest: new FormControl<number | null>(null, [Validators.required]),
    transaction_or_number: new FormControl<number | null>(null),
    balance_interest: new FormControl<number | null>(null),
    change: new FormControl<number | null>(null),
    is_interest_applied: new FormControl<boolean | null>(true),
    transaction_remarks: new FormControl<string | null>(''),
    balance: new FormControl<number | null>(null),
  });

  /**
   * Custom Validator for collection >= required_collection
   */
  private validateCollection(control: AbstractControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup;

    if (!formGroup) return null;

    const collection = control.value;
    const requiredCollection = formGroup.get('required_collection')?.value;

    return collection !== null && requiredCollection !== null && collection < requiredCollection
      ? { insufficientCollection: true }
      : null;
  }

  /**
 * Initializes the loan data and sets interest & required collection.
 */
  private computeLoanInterest(): void {
    const { transactions, loan } = this.loanData;

    this.entryForm.patchValue({
      interest: this.computeService.evaluateInterestAmount(transactions, loan),
    });
  }

  ngOnInit(): void {
    this.computeLoanInterest();

    this.monitorFormValueChanges();
  }

  /**
   * Subscribes to changes in the form controls and updates the required collection value.
   * 
   * This method listens for changes in the `payment` form control and recalculates the 
   * `required_collection` value by adding the current `payment` value and the `interest` value.
   * The recalculated `required_collection` value is then patched back into the form.
   * 
   * @private
   */
  /**
   * Monitors changes in the form controls and updates related values accordingly.
   * 
   * This method subscribes to value changes in the `payment` and `collection` form controls
   * and recalculates the `required_collection`, `change`, and `balance` values based on the
   * new input values.
   * 
   * - When the `payment` value changes, the `required_collection` is recalculated as the sum
   *   of the `payment` and `interest` values.
   * - When the `collection` value changes, the `change` value is recalculated as the difference
   *   between the `collection` and `required_collection` values, ensuring it is not negative.
   *   Additionally, the `balance` value is recalculated as the difference between the last
   *   transaction's balance and the `payment` value, ensuring it is not negative.
   * 
   * @private
   */
  private monitorFormValueChanges(): void {
    const { transactions, loan } = this.loanData;

    // Subscribe to changes in the payment form control and recalculate the required collection value.
    const { payment, interest, required_collection, collection } = this.entryForm.controls;

    payment?.valueChanges.subscribe((payment) => {
      // Calculate the required collection value by adding the payment and interest values.
      const required_collection = (payment ?? 0) + (interest?.value ?? 0);
      this.entryForm.patchValue({ required_collection });
    });

    // Subscribe to changes in the collection form control and recalculate the change value.
    collection?.valueChanges.subscribe((collection) => {

      // Calculate the change value by subtracting the required collection from the collection value.
      const changeValue = (collection ?? 0) - (required_collection.value ?? 0);
      this.entryForm.patchValue({ change: Math.max(changeValue, 0) });

      // Calculate the balance value by subtracting the payment value from the last transaction balance.
      const { transactions } = this.loanData;
      const lastTransaction = transactions[transactions.length - 1];
      const balanceValue = (lastTransaction.balance ?? 0) - (payment.value ?? 0);
      this.entryForm.patchValue({ balance: Math.max(balanceValue, 0) });
    });

    // Check if the interest is applied then make then set the interest to 0
    this.entryForm.get('is_interest_applied')?.valueChanges.subscribe((isInterestApplied) => {
      if (!isInterestApplied) {
        this.entryForm.patchValue({ interest: 0 });
      } else {
        this.entryForm.patchValue({
          interest: this.computeService.evaluateInterestAmount(transactions, loan),
        });
      }
    });
  }

  handleEntrySubmit() {
    if (this.entryForm.invalid) return;
    const { required_collection, transaction_or_number, ...formValue } = this.entryForm.value;
    const sanitizedFormValue = Object.fromEntries(
      Object.entries(formValue).map(([key, value]) => [key, value ?? 0])
    );
    this.ref.close({
      ...sanitizedFormValue,
      transaction_or_number,
      transaction_status: TRANSACTION_STATUS.APPROVED,
    });

    this.entryForm.reset();
  }
}