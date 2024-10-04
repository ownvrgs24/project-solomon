import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../../shared/directives/to-uppercase.directive';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../../shared/services/utils.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

interface PersonalInformation {
  last_name: FormControl<string | null>;
  first_name: FormControl<string | null>;
  middle_name: FormControl<string | null>;
  suffix: FormControl<string | null>;
  gender: FormControl<string | null>;
  civil_status: FormControl<string | null>;
  contact_no: FormControl<string | null>;
  telephone_number: FormControl<string | null>;
  email_address: FormControl<string | null>;
  date_of_birth: FormControl<Date | null>;
}

@Component({
  selector: 'app-personal-information-form',
  standalone: true,
  imports: [DividerModule, InputTextModule, InputMaskModule, UpperCaseInputDirective, DropdownModule, CalendarModule, ReactiveFormsModule, CommonModule],

  templateUrl: './personal-information-form.component.html',
  styleUrl: './personal-information-form.component.scss'
})
export class PersonalInformationFormComponent {

  private utils = inject(UtilsService);

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
    suffix: new FormControl(''),
    gender: new FormControl('', [Validators.required]),
    civil_status: new FormControl('', [Validators.required]),
    contact_no: new FormControl(''),
    telephone_number: new FormControl(''),
    email_address: new FormControl(''),
    date_of_birth: new FormControl(),
  });


  get computeAge(): number {
    const birthdate = this.personalInformationForm.get('date_of_birth')?.value;
    return this.utils.computeAge(birthdate ?? new Date());
  }

  submitPersonalInformation(): void {
    console.log(this.personalInformationForm.value);

    // TODO: Implement submit logic here
    // After submitting the form, the form should be reset and send this generated customer id to the next form
  }
}
