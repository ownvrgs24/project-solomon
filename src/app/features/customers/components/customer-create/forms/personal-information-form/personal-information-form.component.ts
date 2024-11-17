import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../../shared/directives/to-uppercase.directive';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from '../../../../../../shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { CustomersService } from '../../../../../../shared/services/customers.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';

interface PersonalInformation {
  last_name: FormControl<string | null>;
  first_name: FormControl<string | null>;
  middle_name: FormControl<string | null>;
  extension_name: FormControl<string | null>;
  gender: FormControl<string | null>;
  civil_status: FormControl<string | null>;
  mobile_number: FormControl<string | null>;
  telephone_number: FormControl<string | null>;
  email_address: FormControl<string | null>;
  date_of_birth: FormControl<Date | null>;
}

@Component({
  selector: 'app-personal-information-form',
  standalone: true,
  imports: [
    FormsModule,
    MessagesModule,
    InputMaskModule,
    KeyFilterModule,
    DividerModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    CommonModule,
    UpperCaseInputDirective,
  ],
  templateUrl: './personal-information-form.component.html',
  styleUrl: './personal-information-form.component.scss',
})
export class PersonalInformationFormComponent implements OnChanges {
  @Output() customerRegistered: EventEmitter<string> = new EventEmitter();
  @Input({ required: false }) customerId!: string | null;
  // Input for updating customer data
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private utils = inject(UtilsService);
  private customerService = inject(CustomersService);

  formMessage: Message[] | undefined;

  genderList: { label: string; value: string }[] = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Others', value: 'OTHERS' },
  ];

  civilStatusList: { label: string; value: string }[] = [
    { label: 'Single', value: 'SINGLE' },
    { label: 'Married', value: 'MARRIED' },
    { label: 'Widowed', value: 'WIDOWED' },
    { label: 'Separated', value: 'SEPARATED' },
    { label: 'Divorced', value: 'DIVORCED' },
  ];

  suffixList: { label: string; value: string | null }[] = [
    { label: 'None', value: null },
    { label: 'Jr.', value: 'JR' },
    { label: 'Sr.', value: 'SR' },
    { label: 'I', value: 'I' },
    { label: 'II', value: 'II' },
    { label: 'III', value: 'III' },
    { label: 'IV', value: 'IV' },
    { label: 'V', value: 'V' },
    { label: 'VI', value: 'VI' },
    { label: 'VII', value: 'VII' },
    { label: 'VIII', value: 'VIII' },
    { label: 'IX', value: 'IX' },
    { label: 'X', value: 'X' },
  ];

  personalInformationForm: FormGroup<PersonalInformation> = new FormGroup({
    first_name: new FormControl<string | null>(null, [Validators.required]),
    last_name: new FormControl<string | null>(null, [Validators.required]),
    middle_name: new FormControl<string | null>(null),
    extension_name: new FormControl<string | null>(null),
    gender: new FormControl<string | null>(null, [Validators.required]),
    civil_status: new FormControl<string | null>(null, [Validators.required]),
    mobile_number: new FormControl<string | null>(null),
    telephone_number: new FormControl<string | null>(null),
    email_address: new FormControl<string | null>(null),
    date_of_birth: new FormControl<Date | null>(null),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.personalInformationForm.patchValue({
        ...this.customerData,
        date_of_birth: this.customerData.date_of_birth ? new Date(this.customerData.date_of_birth) : null,
      });
    }
  }

  get computeAge(): number {
    const birthday = this.personalInformationForm.get('date_of_birth')?.value;
    return this.utils.computeAge(birthday ?? new Date());
  }

  updatePersonalInformation(): void {
    const { value } = this.personalInformationForm;
    this.customerService
      .updateCustomerPersonalData({
        ...value,
        customer_id: this.customerData.customer_id,
      })
      .subscribe({
        next: (data: any) => {
          this.formMessage = [
            { severity: 'success', summary: 'Success', detail: data.message },
          ];
        },
        error: (error: TypeError) => {
          this.formMessage = [
            { severity: 'error', summary: 'Error', detail: error.message },
          ];
        },
      });
  }

  submitPersonalInformation(): void {
    if (this.isEditMode) {
      this.updatePersonalInformation();
      return;
    }

    const { value } = this.personalInformationForm;
    this.customerService.registerCustomer(value).subscribe({
      next: (data: any) => {
        if (this.customerId) {
          this.linkCustomerCoMaker(data.customer.customer_id);
        }
        this.customerRegistered.emit(data.customer.customer_id);
        this.formMessage = [
          { severity: 'success', summary: 'Success', detail: data.message },
        ];
        this.personalInformationForm.disable();
      },
      error: (error: TypeError) => {
        this.formMessage = [
          { severity: 'error', summary: 'Error', detail: error.message },
        ];
      },
    });
  }

  linkCustomerCoMaker(customerId: string): void {
    this.customerService
      .linkCustomerCoMaker({
        customer_id: this.customerId,
        comaker_id: customerId,
      })
      .subscribe({
        next: (data: any) => {
          this.formMessage = [
            { severity: 'success', summary: 'Success', detail: data.message },
          ];
        },
        error: (error: TypeError) => {
          this.formMessage = [
            { severity: 'error', summary: 'Error', detail: error.message },
          ];
        },
      });
  }
}
