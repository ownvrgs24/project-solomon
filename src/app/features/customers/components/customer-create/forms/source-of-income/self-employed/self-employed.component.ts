import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';

interface SelfEmployedDetails {
  customer_id: FormControl<string | null>;
  net_income: FormControl<string | null>;
  source: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-self-employed',
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
    InputNumberModule
  ],
  templateUrl: './self-employed.component.html',
  styleUrl: './self-employed.component.scss'
})
export class SelfEmployedComponent {

  selfEmployedFormGroup: FormGroup<SelfEmployedDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    net_income: new FormControl<string | null>(null),
    source: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null)
  });

}
