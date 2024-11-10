import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../shared/services/user.service';

interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(MessageService);
  private readonly userService = inject(UserService);

  authForm = new FormGroup<LoginForm>({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  onLogin() {
    this.authService.userLogin(this.authForm.value).subscribe({
      next: (res: any) => {
        this.userService.setSession(res.data);

        this.router.navigate(['/core']);
        this.authForm.reset();

        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
          life: 3000
        });
      },
      error: (err) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000
        });
      }
    });
  }

}
