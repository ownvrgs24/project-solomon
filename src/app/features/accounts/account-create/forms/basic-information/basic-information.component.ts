import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

interface basicInformation {
  last_name: FormControl<string | null>,
  first_name: FormControl<string | null>,
  middle_name: FormControl<string | null>,
  suffix: FormControl<string | null>,
  email_address: FormControl<string | null>,
}

@Component({
  selector: 'app-basic-information',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, KeyFilterModule, DropdownModule, ButtonModule],
  templateUrl: './basic-information.component.html',
  styleUrl: './basic-information.component.scss'
})
export class BasicInformationComponent {

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

  basicInformation: FormGroup<basicInformation> = new FormGroup<basicInformation>({
    last_name: new FormControl<string | null>(null, [Validators.required]),
    first_name: new FormControl<string | null>(null, [Validators.required]),
    middle_name: new FormControl<string | null>(null),
    suffix: new FormControl<string | null>(null),
    email_address: new FormControl<string | null>(null),
  });
}
