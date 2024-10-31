import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { IconFieldModule } from 'primeng/iconfield';
import { TabViewModule } from 'primeng/tabview';
import { CourtHearingComponent } from './actions-taken/court-hearing/court-hearing.component';
import { DemandNoticeComponent } from './actions-taken/demand-notice/demand-notice.component';
import { ReportedlyComponent } from './actions-taken/reportedly/reportedly.component';
import { OtherActionsComponent } from './actions-taken/other-actions/other-actions.component';
import { BlockUIModule } from 'primeng/blockui';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../../../../../shared/services/customers.service';
import { MessagesModule } from 'primeng/messages';

interface DelinquentStatus {
  isDelinquent: FormControl<boolean | null>;
}

@Component({
  selector: 'app-delinquent-status',
  standalone: true,
  imports: [
    FieldsetModule,
    CheckboxModule,
    IconFieldModule,
    FormsModule,
    TabViewModule,
    CourtHearingComponent,
    DemandNoticeComponent,
    ReportedlyComponent,
    OtherActionsComponent,
    BlockUIModule,
    ReactiveFormsModule,
    CommonModule,
    MessagesModule,
  ],
  templateUrl: './delinquent-status.component.html',
  styleUrl: './delinquent-status.component.scss',
  providers: [MessageService],
})
export class DelinquentStatusComponent implements OnChanges {
  @Input({ required: false }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private customerService: CustomersService = inject(CustomersService);
  private messagesService = inject(MessageService);

  blockedPanel: boolean = false;

  delinquentStatusForm: FormGroup<DelinquentStatus> = new FormGroup({
    isDelinquent: new FormControl<boolean | null>(null),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      if (this.customerData.client_status === 'DELINQUENT') {
        this.delinquentStatusForm.get('isDelinquent')?.setValue(true);
      } else {
        this.delinquentStatusForm.get('isDelinquent')?.setValue(false);
      }
    }
  }

  delinquentStatusOnChange($event: CheckboxChangeEvent): void {
    const isDelinquent = $event.checked;
    this.delinquentStatusForm.get('isDelinquent')?.setValue(isDelinquent);
    const confirmationConfig = {
      header: 'Confirmation',
      target: $event?.originalEvent?.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      message: isDelinquent
        ? 'Are you sure you want to mark this customer as DELINQUENT?'
        : 'Are you sure you want to mark this customer as ACTIVE?',
      accept: () => {
        isDelinquent
          ? this.flagCustomerAsDelinquent()
          : this.updateCustomerStatus();
      },
      reject: () => {
        this.delinquentStatusForm.get('isDelinquent')?.setValue(!isDelinquent);
      },
    };

    this.confirmationService.confirm(confirmationConfig);
  }

  flagCustomerAsDelinquent(): void {
    this.customerService
      .markAsDelinquent({
        customer_id: this.customerId || this.customerData?.customer_id,
      })
      .subscribe({
        next: (response: any) => {
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        },
        error: () => {
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to flag customer as DELINQUENT',
          });
        },
      });
  }

  updateCustomerStatus(): void {
    this.customerService.updateCustomerStatus({
      customer_id: this.customerId || this.customerData?.customer_id,
      client_status: 'ACTIVE',
    }).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
      },
      error: () => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update customer status to ACTIVE',
        });
      },
    });
  }
}
