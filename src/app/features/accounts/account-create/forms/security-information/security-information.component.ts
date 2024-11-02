import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { UpperCaseInputDirective } from '../../../../../shared/directives/to-uppercase.directive';

@Component({
  selector: 'app-security-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule,
    MultiSelectModule,
    CommonModule,
    UpperCaseInputDirective
  ],
  templateUrl: './security-information.component.html',
  styleUrl: './security-information.component.scss'
})
export class SecurityInformationComponent implements OnInit {
  @Input() formGroupName!: string;
  @Input() editMode: boolean = false;

  private formGroupDirective = inject(FormGroupDirective);

  form!: FormGroup;

  ngOnInit() {
    this.form = this.formGroupDirective.control.get(this.formGroupName) as FormGroup;
  }

  roleList: { label: string; value: string | null }[] = [
    { label: 'Administrator', value: 'ADMINISTRATOR' },
    { label: 'Encoder', value: 'ENCODER' },
    { label: 'Cashier', value: 'CASHIER' },
  ];
}