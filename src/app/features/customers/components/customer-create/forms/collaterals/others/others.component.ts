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
import { OtherService } from '../../../../../../../shared/services/collaterals/other.service';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface OthersDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-others',
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
    MessagesModule,
  ],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
})
export class OthersComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private otherCollateralService = inject(OtherService);
  private messageService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  othersFormGroup: FormGroup<{
    listRemarks: FormArray<FormGroup<OthersDetails>>;
  }> = new FormGroup({
    listRemarks: new FormArray<FormGroup<OthersDetails>>([]),
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeOtherCollateralForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeOtherCollateralForm(this.customerData.cl_other);
    }
  }

  synchronizeOtherCollateralForm(customerData: any) {
    const otherCollateralRecords = customerData;

    const otherCollateralFormArray = this.othersFormGroup.get(
      'listRemarks'
    ) as FormArray;
    otherCollateralFormArray.clear();

    otherCollateralRecords.forEach((record: any) => {
      console.log(record);

      (this.othersFormGroup.get('listRemarks') as FormArray).push(
        new FormGroup<OthersDetails>({
          customer_id: new FormControl<string | null>(
            record.customer_id || this.customerData.customer_id,
            [Validators.required]
          ),
          id: new FormControl<string | null>(record.id),
          remarks: new FormControl<string | null>(record.remarks),
        })
      );
    });
  }

  private buildOtherCollateralFormGroup(): FormGroup<OthersDetails> {
    return new FormGroup<OthersDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      id: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  initializeOtherCollateralForm() {
    (this.othersFormGroup.get('listRemarks') as FormArray)?.push(
      this.buildOtherCollateralFormGroup()
    );
  }

  removeOtherCollateral(index: number, id?: string) {
    console.log('removeOtherCollateral', index, id);

    if (this.isEditMode && id) {
      this.deleteOtherCollateral(index, id);
      return;
    }

    (this.othersFormGroup.get('listRemarks') as FormArray)?.removeAt(index);
  }

  deleteOtherCollateral(index: number, id: string) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.otherCollateralService.deleteOtherCollateral(id).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeOtherCollateral(index);
          },
          error: (error: any) => {
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

  upsertOtherCollateral(): void {
    const { listRemarks } = this.othersFormGroup.value;
    this.otherCollateralService.updateOtherCollateral(listRemarks).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeOtherCollateralForm(response.data);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  submitForm() {
    if (this.isEditMode) {
      this.upsertOtherCollateral();
      return;
    }

    const { listRemarks } = this.othersFormGroup.value;
    if (this.othersFormGroup.valid) {
      this.otherCollateralService.addOtherCollateral(listRemarks).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.synchronizeOtherCollateralForm(response.data);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
    }
  }
}
