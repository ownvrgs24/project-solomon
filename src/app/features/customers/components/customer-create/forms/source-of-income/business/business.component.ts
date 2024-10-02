import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { InputTextareaModule } from 'primeng/inputtextarea';

interface BusinessDetails {
  customer_id: FormControl<string | null>
  business_name: FormControl<string | null>
  net_income: FormControl<string | null>
  business_address: FormControl<string | null>
  business_contact: FormControl<string | null>
  business_telephone: FormControl<string | null>
  business_email: FormControl<string | null>
  remarks: FormControl<string | null>
}

@Component({
  selector: 'app-business',
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
    InputTextareaModule
  ],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent {

  businessFormGroup: FormGroup<BusinessDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    business_name: new FormControl<string | null>(null),
    net_income: new FormControl<string | null>(null),
    business_address: new FormControl<string | null>(null),
    business_contact: new FormControl<string | null>(null),
    business_telephone: new FormControl<string | null>(null),
    business_email: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null)
  });

}
