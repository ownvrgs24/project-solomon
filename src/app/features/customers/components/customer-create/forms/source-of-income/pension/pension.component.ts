import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { InputNumberModule } from 'primeng/inputnumber';


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
  ],
  templateUrl: './pension.component.html',
  styleUrl: './pension.component.scss'
})

export class PensionComponent {

  pensionFormGroup: FormGroup<PensionDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    source: new FormControl<string | null>(null, [Validators.required]),
    amount: new FormControl<string | null>(null, [Validators.required]),
    pay_frequency: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null)
  });


}
