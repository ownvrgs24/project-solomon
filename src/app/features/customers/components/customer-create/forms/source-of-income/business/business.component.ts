import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BusinessOwnerService } from '../../../../../../../shared/services/source-of-income/business-owner.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface BusinessDetails {
  customer_id: FormControl<string | null>;
  business_name: FormControl<string | null>;
  net_income: FormControl<string | null>;
  business_address: FormControl<string | null>;
  business_contact: FormControl<string | null>;
  business_telephone: FormControl<string | null>;
  business_email: FormControl<string | null>;
  remarks: FormControl<string | null>;
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
    InputTextareaModule,
    KeyFilterModule,
    MessagesModule,
  ],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss',
})
export class BusinessComponent {
  @Input({ required: true }) customerId!: string | null;

  private businessService = inject(BusinessOwnerService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.businessFormGroup.controls.customer_id.setValue(this.customerId);
  }

  businessFormGroup: FormGroup<BusinessDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(this.customerId, [
      Validators.required,
    ]),
    business_name: new FormControl<string | null>(null, [Validators.required]),
    net_income: new FormControl<string | null>(null, [Validators.required]),
    business_address: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    business_contact: new FormControl<string | null>(null),
    business_telephone: new FormControl<string | null>(null),
    business_email: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null),
  });

  submitForm() {
    this.businessService
      .addBusinessOwner(this.businessFormGroup.value)
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.businessFormGroup.disable();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }
}
