import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AccountService } from '../../../../../shared/services/account.service';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    CommonModule,
    FieldsetModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly accountService = inject(AccountService);
  private readonly toastService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  account_id!: string;

  changePasswordForm = new FormGroup({
    old_password: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator() });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.account_id = params['id'];
    });
  }

  submitChangePassword() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change your password?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, change my password',
      rejectLabel: 'No, cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        this.accountService.changePassword({
          account_id: this.account_id,
          ...this.changePasswordForm.value
        }).subscribe({
          next: (res: any) => {
            this.toastService.add({ severity: 'success', summary: 'Success', detail: res.message, life: 3000 });
            this.changePasswordForm.reset();
            this.router.navigate(['core/accounts/list']);
          },
          error: (err) => {
            this.toastService.add({ severity: 'error', summary: 'Error', detail: err.error.message, life: 3000 });
          }
        });
      }
    });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirm_password')?.value;

      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }
}
