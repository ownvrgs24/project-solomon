import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { BankCheckService } from '../../../../../../../shared/services/collaterals/bank-check.service';

interface BankCheckDetails {
  customer_id: FormControl<string | null>;
  check_date: FormControl<Date | null>;
  issuing_bank: FormControl<string | null>;
  amount: FormControl<string | null>;
  check_number: FormControl<string | null>;
  payee: FormControl<string | null>;
  date_acquired: FormControl<Date | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-bank-check',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule,
    KeyFilterModule,
    UpperCaseInputDirective,
  ],
  templateUrl: './bank-check.component.html',
  styleUrl: './bank-check.component.scss'
})
export class BankCheckComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API
  private bankCheckService = inject(BankCheckService);

  @Input({ required: true }) customerId!: string | null;


  bankCheckFormGroup: FormGroup<{ check: FormArray<FormGroup<BankCheckDetails>> }> = new FormGroup({
    check: new FormArray<FormGroup<BankCheckDetails>>([])
  });

  private buildBankCheckFormGroup(): FormGroup<BankCheckDetails> {
    return new FormGroup<BankCheckDetails>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      payee: new FormControl<string | null>(null, [Validators.required]),
      amount: new FormControl<string | null>(null, [Validators.required]),
      check_date: new FormControl<Date | null>(null),
      issuing_bank: new FormControl<string | null>(null),
      check_number: new FormControl<string | null>(null),
      date_acquired: new FormControl<Date | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    this.initializeBankCheckForm();
  }

  initializeBankCheckForm() {
    (this.bankCheckFormGroup.get('check') as FormArray).push(this.buildBankCheckFormGroup());
  }

  removeBankCheckForm(index: number) {
    (this.bankCheckFormGroup.get('check') as FormArray).removeAt(index);
  }

  submitForm() {
    let { check } = this.bankCheckFormGroup.value;
    this.bankCheckService.addBankCheck(check).subscribe({
      next: () => {
        console.log('Bank Check form submitted successfully');
      },
      error: (error) => {
        console.error('Error submitting Bank Check form', error);
      }
    });
  }

}
