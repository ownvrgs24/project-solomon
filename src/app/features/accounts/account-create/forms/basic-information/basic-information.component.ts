import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../shared/directives/to-uppercase.directive';



@Component({
  selector: 'app-basic-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    KeyFilterModule,
    DropdownModule,
    ButtonModule,
    UpperCaseInputDirective
  ],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.scss'
})
export class BasicInformationComponent implements OnInit {

  private formGroupDirective = inject(FormGroupDirective);

  @Input() formGroupName!: string;
  form!: FormGroup;

  ngOnInit() {
    this.form = this.formGroupDirective.control.get(this.formGroupName) as FormGroup;
  }

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

}
