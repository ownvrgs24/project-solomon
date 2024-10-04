import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';

interface SecurityInformation {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  confirm_password: FormControl<string | null>;
  role: FormControl<string | null>;
  restrictions: FormControl<string[] | null>;
}

@Component({
  selector: 'app-security-information',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, DropdownModule, ButtonModule, MultiSelectModule],
  templateUrl: './security-information.component.html',
  styleUrl: './security-information.component.scss'
})
export class SecurityInformationComponent {

  securityInformationForm: FormGroup<SecurityInformation> = new FormGroup<SecurityInformation>({
    username: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required]),
    confirm_password: new FormControl<string | null>(null, [Validators.required]),
    role: new FormControl<string | null>(null, [Validators.required]),
    restrictions: new FormControl<string[] | null>(null, [Validators.required]),
  });


  // TODO: Fetch the data from the API and populate the restrictionList
  restrictionList: any[] | undefined;

  roleList: { label: string; value: string | null }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Encoder', value: 'encoder' },
    { label: 'Cashier', value: 'cashier' },
  ];

}
