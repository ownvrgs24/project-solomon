import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-security-information',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, DropdownModule, ButtonModule, MultiSelectModule, CommonModule],
  templateUrl: './security-information.component.html',
  styleUrl: './security-information.component.scss'
})
export class SecurityInformationComponent implements OnInit {

  securityInformationForm!: FormGroup;

  restrictionList: any[] | undefined;

  roleList: { label: string; value: string | null }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Encoder', value: 'encoder' },
    { label: 'Cashier', value: 'cashier' },
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.securityInformationForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
      role: [null, Validators.required],
      restrictions: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: AbstractControl): { password_mismatch: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ password_mismatch: true });
      return { password_mismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }
}