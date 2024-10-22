import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { KeyFilterModule } from 'primeng/keyfilter';
import { LotService } from '../../../../../../../shared/services/collaterals/lot.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface LotDetails {
  customer_id: FormControl<string | null>;
  l_property_address: FormControl<string | null>;
  l_property_type: FormControl<string | null>;
  l_property_value: FormControl<string | null>;
  l_tax_deed_number: FormControl<string | null>;
  l_tax_declaration_number: FormControl<string | null>;
  l_sqm_area: FormControl<string | null>;
  l_title_number: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-lot',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule,
    KeyFilterModule,
    MessagesModule,
  ],
  templateUrl: './lot.component.html',
  styleUrl: './lot.component.scss',
})
export class LotComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  @Input({ required: true }) customerId!: string | null;

  private lotService = inject(LotService);
  private messagesService = inject(MessageService);

  lotFormGroup: FormGroup<{ lot: FormArray<FormGroup<LotDetails>> }> =
    new FormGroup({
      lot: new FormArray<FormGroup<LotDetails>>([]),
    });

  private buildLotFormGroup(): FormGroup<LotDetails> {
    return new FormGroup<LotDetails>({
      customer_id: new FormControl<string | null>(this.customerId, [
        Validators.required,
      ]),
      l_property_address: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      l_property_value: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      l_property_type: new FormControl<string | null>(null),
      l_tax_deed_number: new FormControl<string | null>(null),
      l_tax_declaration_number: new FormControl<string | null>(null),
      l_sqm_area: new FormControl<string | null>(null),
      l_title_number: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    this.addLot();
  }

  addLot(): void {
    (this.lotFormGroup.get('lot') as FormArray)?.push(this.buildLotFormGroup());
  }

  removeLot(index: number): void {
    (this.lotFormGroup.get('lot') as FormArray)?.removeAt(index);
  }

  submitForm(): void {
    let { lot } = this.lotFormGroup.value;
    this.lotService.addLot(lot).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.lotFormGroup.disable();
      },
      error: (error) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }
}
