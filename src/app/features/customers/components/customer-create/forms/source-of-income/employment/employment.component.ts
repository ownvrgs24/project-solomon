import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { CalendarModule } from 'primeng/calendar';

interface EmploymentDetails {
  customer_id: FormControl<string | null>;
  designation: FormControl<string | null>;
  company: FormControl<string | null>;
  company_address: FormControl<string | null>;
  company_contact: FormControl<string | null>;
  company_email: FormControl<string | null>;
  date_of_employment: FormControl<Date | null>;
  net_salary: FormControl<string | null>;
  pay_frequency: FormControl<string | null>;
  status: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-employment',
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
    InputNumberModule,
    InputTextareaModule,
    CalendarModule,
  ],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss'
})
export class EmploymentComponent {

  employmentFormGroup: FormGroup<EmploymentDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    designation: new FormControl<string | null>(null, [Validators.required]),
    company: new FormControl<string | null>(null, [Validators.required]),
    net_salary: new FormControl<string | null>(null, [Validators.required]),
    company_address: new FormControl<string | null>(null),
    company_contact: new FormControl<string | null>(null),
    company_email: new FormControl<string | null>(null),
    date_of_employment: new FormControl<Date | null>(null),
    pay_frequency: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null)
  });
}
