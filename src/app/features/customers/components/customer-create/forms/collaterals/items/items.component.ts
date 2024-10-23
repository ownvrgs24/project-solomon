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
import { ItemService } from '../../../../../../../shared/services/collaterals/item.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface ItemDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  item_description: FormControl<string | null>;
  item_serial_number: FormControl<string | null>;
  item_quantity: FormControl<string | null>;
  item_monetary_value: FormControl<string | null>;
  date_acquired: FormControl<Date | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-items',
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
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private itemService = inject(ItemService);
  private messagesService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  itemsFormGroup: FormGroup<{ items: FormArray<FormGroup<ItemDetails>> }> =
    new FormGroup({
      items: new FormArray<FormGroup<ItemDetails>>([]),
    });

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.addItem();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeItems(this.customerData?.cl_item);
      if (this.customerData.cl_item.length === 0) {
        this.addItem();
      }
    }
  }

  synchronizeItems(customerData: any): void {
    const itemRecords = customerData;

    const itemsFormArray = this.itemsFormGroup.get('items') as FormArray;
    itemsFormArray.clear();

    itemRecords.forEach((item: any) => {
      itemsFormArray.push(
        new FormGroup<ItemDetails>({
          customer_id: new FormControl<string | null>(
            item.customer_id || this.customerId,
            [Validators.required]
          ),
          id: new FormControl<string | null>(item.id),
          item_description: new FormControl<string | null>(
            item.item_description,
            [Validators.required]
          ),
          item_monetary_value: new FormControl<string | null>(
            item.item_monetary_value,
            [Validators.required]
          ),
          item_serial_number: new FormControl<string | null>(
            item.item_serial_number
          ),
          item_quantity: new FormControl<string | null>(item.item_quantity),
          date_acquired: new FormControl<Date | null>(
            new Date(item.date_acquired)
          ),
          remarks: new FormControl<string | null>(item.remarks),
        })
      );
    });
  }

  private buildItemFormGroup(): FormGroup<ItemDetails> {
    return new FormGroup<ItemDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      item_description: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      item_monetary_value: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      item_serial_number: new FormControl<string | null>(null),
      item_quantity: new FormControl<string | null>(null),
      date_acquired: new FormControl<Date | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  addItem(): void {
    (this.itemsFormGroup.get('items') as FormArray)?.push(
      this.buildItemFormGroup()
    );
  }

  removeItem(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteItemRecord(id, index);
      return;
    }

    (this.itemsFormGroup.get('items') as FormArray)?.removeAt(index);
  }

  deleteItemRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.itemService.deleteItem(id).subscribe({
          next: (response: any) => {
            this.messagesService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeItem(index);
          },
          error: (error) => {
            this.messagesService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
      },
    });
  }

  upsertItemRecords(): void {
    let { items } = this.itemsFormGroup.value;
    this.itemService.updateItem(items).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeItems(response.data);
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

  submitForm(): void {
    if (this.isEditMode) {
      this.upsertItemRecords();
      return;
    }

    let { items } = this.itemsFormGroup.value;
    this.itemService.addItem(items).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeItems(response.data);
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
