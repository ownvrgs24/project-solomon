import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { UtilsService } from '../../../../../shared/services/utils.service';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../shared/directives/to-uppercase.directive';

interface AdditionalInformation {
  date_of_birth: FormControl<Date | null>
  contact_number: FormControl<string | null>
  gender: FormControl<string | null>
  address: FormControl<string | null>
}

@Component({
  selector: 'app-additional-information',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, CalendarModule, DropdownModule, ButtonModule, InputMaskModule, UpperCaseInputDirective],
  templateUrl: './additional-information.component.html',
  styleUrl: './additional-information.component.scss'
})
export class AdditionalInformationComponent {

  private utils = inject(UtilsService);

  additionalInformationForm: FormGroup<AdditionalInformation> = new FormGroup<AdditionalInformation>({
    date_of_birth: new FormControl<Date | null>(null, [Validators.required]),
    contact_number: new FormControl<string | null>(null, [Validators.required]),
    gender: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null, [Validators.required]),
  });

  genderList: { label: string; value: string }[] = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Others', value: 'OTHERS' },
  ];


  get computeAge(): number {
    const birthdate = this.additionalInformationForm.get('date_of_birth')?.value;
    return this.utils.computeAge(birthdate ?? new Date());
  }
}
