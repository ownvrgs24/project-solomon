import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { PensionService } from '../../../../../../../shared/services/source-of-income/pension.service';
import { DropdownModule } from 'primeng/dropdown';


interface PensionDetails {
  customer_id: FormControl<string | null>;
  amount: FormControl<string | null>;
  pay_frequency: FormControl<string | null>;
  source: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-pension',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './pension.component.html',
  styleUrl: './pension.component.scss'
})

export class PensionComponent {

  @Input({ required: true }) customerId!: string | null;

  private pensionService = inject(PensionService);

  payfrequency: { label: string; value: string }[] = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Bi-Monthly', value: 'BI_MONTHLY' },
    { label: 'Semi-Monthly', value: 'SEMI_MONTHLY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annually', value: 'ANNUALLY' }
  ];

  pensionFormGroup: FormGroup<PensionDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    source: new FormControl<string | null>(null, [Validators.required]),
    amount: new FormControl<string | null>(null, [Validators.required]),
    pay_frequency: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null)
  });

  ngOnInit(): void {
    this.pensionFormGroup.controls.customer_id.setValue(this.customerId);
  }

  submitForm(): void {
    this.pensionService.addPension(this.pensionFormGroup.value).subscribe({
      next: () => {
        console.log('Pension form submitted successfully');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
