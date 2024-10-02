import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';

interface CardDetails {
  customer_id: FormControl<string | null>;
  issuing_bank: FormControl<string | null>;
  card_number: FormControl<string | null>;
  account_number: FormControl<string | null>;
  account_name: FormControl<string | null>;
  account_type: FormControl<string | null>;
  pin: FormControl<string | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-atm-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
  ],
  templateUrl: './atm-card.component.html',
  styleUrl: './atm-card.component.scss'
})
export class AtmCardComponent {

  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  atmCardFormGroup: FormGroup<{ card: FormArray<FormGroup<CardDetails>> }> = new FormGroup({
    card: new FormArray([this.buildAtmCardFormGroup()])
  });

  private buildAtmCardFormGroup(): FormGroup<CardDetails> {
    return new FormGroup<CardDetails>({
      customer_id: new FormControl<string | null>('1'),
      account_name: new FormControl<string | null>(null, [Validators.required]),
      account_number: new FormControl<string | null>(null, [Validators.required]),
      card_number: new FormControl<string | null>(null, [Validators.required]),
      pin: new FormControl<string | null>(null, [Validators.required]),
      issuing_bank: new FormControl<string | null>(null, [Validators.required]),
      account_type: new FormControl<string | null>(null),
      username: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  initializeCardForm() {
    (this.atmCardFormGroup.get('card') as FormArray)?.push(this.buildAtmCardFormGroup());
  }

  removeCardForm(index: number) {
    (this.atmCardFormGroup.get('card') as FormArray)?.removeAt(index);
  }
}
