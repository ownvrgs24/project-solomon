import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BasicInformationComponent } from "./forms/basic-information/basic-information.component";
import { SecurityInformationComponent } from "./forms/security-information/security-information.component";
import { AdditionalInformationComponent } from "./forms/additional-information/additional-information.component";
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { AccountService } from '../../../shared/services/account.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { Account } from '../account-list/account-list.component';


interface UserAccount {
  basicInformation: FormGroup<BasicInformation>,
  additionalInformationForm: FormGroup<AdditionalInformation>,
  securityInformation: FormGroup<SecurityInformation>
}

interface BasicInformation {
  last_name: FormControl<string | null>,
  first_name: FormControl<string | null>,
  middle_name: FormControl<string | null>,
  extension_name: FormControl<string | null>,
  email_address: FormControl<string | null>,
}

interface AdditionalInformation {
  date_of_birth: FormControl<Date | null>
  contact_number: FormControl<string | null>
  gender: FormControl<string | null>
  address: FormControl<string | null>
}

interface SecurityInformation {
  username: FormControl<string | null>
  password: FormControl<string | null>
  confirm_password: FormControl<string | null>
  role: FormControl<string | null>
}


@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    BasicInformationComponent,
    SecurityInformationComponent,
    AdditionalInformationComponent,
    ReactiveFormsModule,
    FieldsetModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.scss'
})
export class AccountCreateComponent implements OnInit, OnChanges {

  @Input() userAccountData!: any;
  @Input() editMode: boolean = false;

  accountForm!: FormGroup<UserAccount>;
  private readonly accountService = inject(AccountService);
  private readonly toastService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.initializeAccountForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.userAccountData) {
      if (this.editMode) {
        const securityInformation = this.accountForm.get('securityInformation') as FormGroup;
        // securityInformation.addControl('old_password', new FormControl(null, [Validators.required]));

        // Remove the confirm_password control and password control
        securityInformation.removeControl('confirm_password');
        securityInformation.removeControl('password');
      }
      this.accountForm.patchValue({
        basicInformation: {
          last_name: this.userAccountData.last_name,
          first_name: this.userAccountData.first_name,
          middle_name: this.userAccountData.middle_name,
          extension_name: this.userAccountData.extension_name,
          email_address: this.userAccountData.email_address,
        },
        additionalInformationForm: {
          date_of_birth: new Date(this.userAccountData.date_of_birth),
          contact_number: this.userAccountData.contact_number,
          gender: this.userAccountData.gender,
          address: this.userAccountData.address,
        },
        securityInformation: {
          username: this.userAccountData.username,
          role: this.userAccountData.role,
        }
      });
    }
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

  isAdultValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthday = control.value;
      if (!birthday) {
        return null;
      }
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
      const monthDifference = today.getMonth() - birthday.getMonth();
      const dayDifference = today.getDate() - birthday.getDate();

      if (age > 18 || (age === 18 && monthDifference > 0) || (age === 18 && monthDifference === 0 && dayDifference >= 0)) {
        return null;
      } else {
        return { underage: true };
      }
    };
  }

  initializeAccountForm() {
    this.accountForm = new FormGroup<UserAccount>({
      basicInformation: new FormGroup<BasicInformation>({
        last_name: new FormControl<string | null>(null, [Validators.required]),
        first_name: new FormControl<string | null>(null, [Validators.required]),
        middle_name: new FormControl<string | null>(null),
        extension_name: new FormControl<string | null>(null),
        email_address: new FormControl<string | null>(null),
      }),
      additionalInformationForm: new FormGroup<AdditionalInformation>({
        date_of_birth: new FormControl<Date | null>(null, [Validators.required, this.isAdultValidator()]),
        contact_number: new FormControl<string | null>(null, [Validators.required]),
        gender: new FormControl<string | null>(null, [Validators.required]),
        address: new FormControl<string | null>(null, [Validators.required]),
      }),
      securityInformation: new FormGroup<SecurityInformation>({
        username: new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required]),
        confirm_password: new FormControl<string | null>(null, [Validators.required]),
        role: new FormControl<string | null>(null, [Validators.required]),
      }, { validators: this.passwordMatchValidator() })
    });
  }

  registerAccount() {

    if (this.editMode) {
      this.updateAccount();
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to create this account?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        let { basicInformation, additionalInformationForm, securityInformation } = this.accountForm.value;
        this.accountService.createAccount({
          ...basicInformation,
          ...additionalInformationForm,
          ...securityInformation
        }).subscribe({
          next: (res: any) => {
            this.toastService.add({ severity: 'success', summary: 'Success', detail: res.message, life: 3000 });
            this.accountForm.reset();
            this.router.navigate(['core/accounts/list']);
          },
          error: (err) => {
            this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create account', life: 3000 });
          }
        });
      }
    });
  }

  updateAccount() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update this account?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        let { basicInformation, additionalInformationForm, securityInformation } = this.accountForm.value;
        this.accountService.updateAccount({
          account_id: this.userAccountData.account_id,
          ...basicInformation,
          ...additionalInformationForm,
          ...securityInformation
        }).subscribe({
          next: (res: any) => {
            this.toastService.add({ severity: 'success', summary: 'Success', detail: res.message, life: 3000 });
            this.accountForm.reset();
            this.router.navigate(['core/accounts/list']);
          },
          error: (err) => {
            this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update account', life: 3000 });
          }
        })
      }
    });
  }
}
