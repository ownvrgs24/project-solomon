import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../../shared/directives/to-uppercase.directive';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../../shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { CustomersService } from '../../../../../../shared/services/customers.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

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
    UpperCaseInputDirective
  ],
  templateUrl: './personal-information-form.component.html',
  styleUrl: './personal-information-form.component.scss'
})
export class PersonalInformationFormComponent {

  formMessage: Message[] | undefined;

  @Output() customerRegistered: EventEmitter<string> = new EventEmitter();

  @Input({ required: false }) customerId!: string | null;

  private utils = inject(UtilsService);

  private customerService = inject(CustomersService);

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
  ]

  personalInformationForm: FormGroup<PersonalInformation> = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    middle_name: new FormControl(''),
    extension_name: new FormControl(''),
    gender: new FormControl('', [Validators.required]),
    civil_status: new FormControl('', [Validators.required]),
    mobile_number: new FormControl(''),
    telephone_number: new FormControl(''),
    email_address: new FormControl(''),
    date_of_birth: new FormControl(),
  });

  ngOnInit(): void {
    console.log(this.customerId);
  }

  get computeAge(): number {
    const birthdate = this.personalInformationForm.get('date_of_birth')?.value;
    return this.utils.computeAge(birthdate ?? new Date());
  }

  submitPersonalInformation(): void {
    const { value } = this.personalInformationForm;
    this.customerService.registerCustomer(value).subscribe({
      next: (data: any) => {

        if (this.customerId) {
          this.linkCustomerCoMaker(data.customer.customer_id);
        }

        this.customerRegistered.emit(data.customer.customer_id);

        this.formMessage = [{ severity: 'success', summary: 'Success', detail: data.message }];
        this.personalInformationForm.disable();
      },
      error: (error: TypeError) => {
        this.formMessage = [{ severity: 'error', summary: 'Error', detail: error.message }];
      }
    });
  }

  linkCustomerCoMaker(customerId: string): void {
    this.customerService.linkCustomerCoMaker({
      customer_id: this.customerId,
      comaker_id: customerId
    }).subscribe({
      next: (data: any) => {
        this.formMessage = [{ severity: 'success', summary: 'Success', detail: data.message }];
      },
      error: (error: TypeError) => {
        this.formMessage = [{ severity: 'error', summary: 'Error', detail: error.message }];
      }
    });
  }
}
