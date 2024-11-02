import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../shared/directives/to-uppercase.directive';
import { UtilsService } from '../../../../../shared/services/utils.service';


@Component({
  selector: 'app-additional-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputMaskModule,
    UpperCaseInputDirective
  ],
  templateUrl: './additional-information.component.html',
  styleUrl: './additional-information.component.scss'
})
export class AdditionalInformationComponent implements OnInit {

  @Input() formGroupName!: string;
  private formGroupDirective = inject(FormGroupDirective);
  private readonly utils = inject(UtilsService);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.formGroupDirective.control.get(this.formGroupName) as FormGroup;
  }

  genderList: { label: string; value: string }[] = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Others', value: 'OTHERS' },
  ];

  get computeAge(): number {
    const birthday = this.form.get('date_of_birth')?.value;
    return this.utils.computeAge(birthday ?? new Date());
  }


}
