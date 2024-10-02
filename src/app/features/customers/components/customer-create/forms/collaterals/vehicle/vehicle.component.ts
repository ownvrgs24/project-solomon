import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

interface VehicleDetails {
  customer_id: FormControl<string | null>;
  vehicle_details: FormControl<string | null>;
  official_receipt: FormControl<string | null>;
  certificate_of_registration: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-vehicle',
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
    InputTextareaModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  vehicleFormGroup: FormGroup<{ vehicle: FormArray<FormGroup<VehicleDetails>> }> = new FormGroup({
    vehicle: new FormArray([this.buildVehicleFormGroup()])
  });

  private buildVehicleFormGroup(): FormGroup<VehicleDetails> {
    return new FormGroup<VehicleDetails>({
      customer_id: new FormControl<string | null>('1'),
      vehicle_details: new FormControl<string | null>(null, [Validators.required]),
      official_receipt: new FormControl<string | null>(null),
      certificate_of_registration: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null)
    });
  }

  addVehicle(): void {
    (this.vehicleFormGroup.get('vehicle') as FormArray)?.push(this.buildVehicleFormGroup());
  }

  removeVehicle(index: number): void {
    (this.vehicleFormGroup.get('vehicle') as FormArray)?.removeAt(index);
  }
}
