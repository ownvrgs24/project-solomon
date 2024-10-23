import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { CalendarModule } from 'primeng/calendar';
import { EmploymentService } from '../../../../../../../shared/services/source-of-income/employment.service';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface EmploymentDetails {
  customer_id: FormControl<string | null>;
  designation: FormControl<string | null>;
  company: FormControl<string | null>;
  company_address: FormControl<string | null>;
  company_contact: FormControl<string | null>;
  company_email: FormControl<string | null>;
  date_of_employment: FormControl<Date | null>;
  net_salary: FormControl<number | null>;
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
    DropdownModule,
    MessagesModule,
  ],
  templateUrl: './employment.component.html',
  styleUrl: './employment.component.scss',
})
export class EmploymentComponent implements OnInit {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private employmentService = inject(EmploymentService);
  private messagesService = inject(MessageService);

  ngOnInit(): void {
    this.performValidationForUpdate();
  }

  performValidationForUpdate() {
    if (this.isEditMode) {
      this.employmentFormGroup.patchValue({
        ...this.customerData?.soi_employment,
        date_of_employment: new Date(
          this.customerData?.soi_employment?.date_of_employment || null
        ),
        customer_id: this.customerData?.customer_id,
      });
      return;
    }

    this.employmentFormGroup.controls.customer_id.setValue(
      this.customerId || this.customerData?.customer_id
    );
  }

  incomePayoutOptions: { label: string; value: string }[] = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Bi-Monthly', value: 'BI_MONTHLY' },
    { label: 'Semi-Monthly', value: 'SEMI_MONTHLY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annually', value: 'ANNUALLY' },
  ];

  employmentOptions: { label: string; value: string }[] = [
    { label: 'Regular', value: 'REGULAR' },
    { label: 'Casual', value: 'CASUAL' },
    { label: 'Contractual', value: 'CONTRACTUAL' },
    { label: 'Probationary', value: 'PROBATIONARY' },
    { label: 'Project', value: 'PROJECT' },
    { label: 'Seasonal', value: 'SEASONAL' },
    { label: 'Fixed', value: 'FIXED' },
    { label: 'Others', value: 'OTHERS' },
  ];

  employmentFormGroup: FormGroup<EmploymentDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(this.customerId, [
      Validators.required,
    ]),
    designation: new FormControl<string | null>(null, [Validators.required]),
    company: new FormControl<string | null>(null, [Validators.required]),
    pay_frequency: new FormControl<string | null>(null, [Validators.required]),
    net_salary: new FormControl<number | null>(null, [Validators.required]),
    company_address: new FormControl<string | null>(null),
    company_contact: new FormControl<string | null>(null),
    company_email: new FormControl<string | null>(null),
    date_of_employment: new FormControl<Date | null>(null),
    status: new FormControl<string | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null),
  });

  updateEmployment() {
    this.employmentService
      .updateEmployment(this.employmentFormGroup.value)
      .subscribe({
        next: (response: any) => {
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.employmentFormGroup.patchValue({
            ...response.data,
            date_of_employment: new Date(response.data.date_of_employment),
          });
        },
        error: (error) => {
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }

  submitEmploymentForm() {
    if (this.isEditMode) {
      this.updateEmployment();
      return;
    }

    this.employmentService
      .addEmployment(this.employmentFormGroup.value)
      .subscribe({
        next: (response: any) => {
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.employmentFormGroup.disable();
        },
        error: (error) => {
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }
}
