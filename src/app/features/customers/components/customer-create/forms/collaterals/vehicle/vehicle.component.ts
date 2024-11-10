import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { VehicleService } from '../../../../../../../shared/services/collaterals/vehicle.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface VehicleDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
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
    InputTextareaModule,
    KeyFilterModule,
    MessagesModule,
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private vehicleService = inject(VehicleService);
  private messageService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  vehicleFormGroup: FormGroup<{
    vehicle: FormArray<FormGroup<VehicleDetails>>;
  }> = new FormGroup({
    vehicle: new FormArray<FormGroup<VehicleDetails>>([]),
  });

  private buildVehicleFormGroup(): FormGroup<VehicleDetails> {
    return new FormGroup<VehicleDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      id: new FormControl<string | null>(null),
      vehicle_details: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      official_receipt: new FormControl<string | null>(null),
      certificate_of_registration: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeVehicleForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeVehicle(this.customerData?.cl_vehicle);
      if (this.customerData.cl_vehicle.length === 0) {
        this.initializeVehicleForm();
      }
    }
  }

  synchronizeVehicle(customerData: any): void {
    const vehicleRecords = customerData;

    const vehicleFormArray = this.vehicleFormGroup.get('vehicle') as FormArray;
    vehicleFormArray.clear();

    vehicleRecords.forEach((vehicle: any) => {
      vehicleFormArray.push(
        new FormGroup<VehicleDetails>({
          customer_id: new FormControl<string | null>(
            vehicle.customer_id || this.customerId,
            [Validators.required]
          ),
          id: new FormControl<string | null>(vehicle.id),
          vehicle_details: new FormControl<string | null>(
            vehicle.vehicle_details,
            [Validators.required]
          ),
          official_receipt: new FormControl<string | null>(
            vehicle.official_receipt
          ),
          certificate_of_registration: new FormControl<string | null>(
            vehicle.certificate_of_registration
          ),
          remarks: new FormControl<string | null>(vehicle.remarks),
        })
      );
    });
  }

  initializeVehicleForm(): void {
    (this.vehicleFormGroup.get('vehicle') as FormArray)?.push(
      this.buildVehicleFormGroup()
    );
  }

  removeVehicle(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteVehicleRecord(id, index);
      return;
    }

    (this.vehicleFormGroup.get('vehicle') as FormArray)?.removeAt(index);
  }

  deleteVehicleRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Vehicle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message: 'Are you sure you want to DELETE this vehicle from the database?',
      accept: () => {
        this.vehicleService.deleteVehicle(id).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeVehicle(index);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
      },
    });
  }

  upsertVehicle(): void {
    let { vehicle } = this.vehicleFormGroup.value;
    this.vehicleService.updateVehicle(vehicle).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeVehicle(response.data);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.upsertVehicle();
      return;
    }

    let { vehicle } = this.vehicleFormGroup.value;
    this.vehicleService.addVehicle(vehicle).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeVehicle(response.data);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }
}
