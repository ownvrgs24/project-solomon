import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { HouseAndLotService } from '../../../../../../../shared/services/collaterals/house-and-lot.service';
import { KeyFilterModule } from 'primeng/keyfilter';

interface HouseAndLotDetails {
  customer_id: FormControl<string | null>;
  hal_property_address: FormControl<string | null>;
  hal_property_type: FormControl<string | null>;
  hal_property_value: FormControl<string | null>;
  hal_tax_deed_number: FormControl<string | null>;
  hal_tax_declaration_number: FormControl<string | null>;
  hal_sqm_area: FormControl<string | null>;
  hal_title_number: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-house-and-lot',
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
  ],
  templateUrl: './house-and-lot.component.html',
  styleUrl: './house-and-lot.component.scss'
})
export class HouseAndLotComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  @Input({ required: true }) customerId!: string | null;

  private houseAndLotService = inject(HouseAndLotService);

  houseAndLotFormGroup: FormGroup<{ houseAndLot: FormArray<FormGroup<HouseAndLotDetails>> }> = new FormGroup({
    houseAndLot: new FormArray<FormGroup<HouseAndLotDetails>>([])
  });

  ngOnInit(): void {
    this.initializeHouseAndLotForm();
  }

  private buildHouseAndLotFormGroup(): FormGroup<HouseAndLotDetails> {
    return new FormGroup<HouseAndLotDetails>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      hal_property_address: new FormControl<string | null>(null, [Validators.required]),
      hal_property_value: new FormControl<string | null>(null, [Validators.required]),
      hal_property_type: new FormControl<string | null>(null),
      hal_tax_deed_number: new FormControl<string | null>(null),
      hal_tax_declaration_number: new FormControl<string | null>(null),
      hal_sqm_area: new FormControl<string | null>(null),
      hal_title_number: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null)
    });
  }

  initializeHouseAndLotForm(): void {
    (this.houseAndLotFormGroup.get('houseAndLot') as FormArray)?.push(this.buildHouseAndLotFormGroup());
  }

  removeHouseAndLot(index: number): void {
    (this.houseAndLotFormGroup.get('houseAndLot') as FormArray)?.removeAt(index);
  }

  submitForm() {
    let { houseAndLot } = this.houseAndLotFormGroup.value;
    this.houseAndLotService.addHouseAndLot(houseAndLot).subscribe({
      next: () => {
        console.log('House and Lot added successfully');
      },
      error: (error) => {
        console.error('Error adding House and Lot', error);
      }
    });
  }

}
