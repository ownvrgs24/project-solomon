import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { CustomerListComponent } from '../../../customer-create/forms/co-maker/customer-list/customer-list.component';
import { SignatoryArrangementComponent } from './signatory-arrangement/signatory-arrangement.component';
import { Chip, ChipModule } from 'primeng/chip';
import { FieldsetModule } from 'primeng/fieldset';
import { HttpService } from '../../../../../../shared/services/http.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { CustomersService } from '../../../../../../shared/services/customers.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-shell-co-maker',
  standalone: true,
  imports: [
    TabViewModule,
    CreateProfileComponent,
    CustomerListComponent,
    SignatoryArrangementComponent,
    FieldsetModule,
    OverlayPanelModule,
    TooltipModule,
    TableModule,
    AvatarModule,
    ButtonModule,
  ],
  templateUrl: './shell-co-maker.component.html',
  styleUrl: './shell-co-maker.component.scss',
})
export class ShellCoMakerComponent implements OnChanges {

  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;
  @Input({ required: false }) customerId!: string | null;

  protected readonly http = inject(HttpService);
  private customerService = inject(CustomersService);
  private readonly confirmService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  public comakerData: {
    recno: number;
    fullname: string;
    email: string;
    mobile: string;
    client_picture: string;
  }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.isEditMode) {
      this.extractCoMakerData(this.customerData);
    }
  }

  extractCoMakerData(customerData: any): void {
    const { co_makers } = customerData;
    this.comakerData = co_makers.map(
      (comaker: {
        recno: number;
        cx_detail: {
          email_address: string;
          extension_name: string;
          first_name: string;
          last_name: string;
          middle_name: string;
          mobile_number: string;
          client_picture: string;
          cx_address: {
            complete_address: string;
          }[];
        };
      }) => {
        return {
          recno: comaker.recno,
          fullname: `${comaker.cx_detail.last_name}, ${
            comaker.cx_detail.first_name
          }${
            comaker.cx_detail.middle_name
              ? ' ' + comaker.cx_detail.middle_name
              : ''
          }${
            comaker.cx_detail.extension_name
              ? ' ' + comaker.cx_detail.extension_name
              : ''
          }`,
          email: comaker.cx_detail.email_address,
          mobile: comaker.cx_detail.mobile_number,
          client_picture: `${this.http.rootURL}/${comaker.cx_detail.client_picture}`,
          cx_address: comaker.cx_detail.cx_address
            .map(
              (address: { complete_address: string }) =>
                address.complete_address
            )
            .join(', '),
        };
      }
    );
  }

  removeCoMaker(params: {
    recno: number;
    fullname: string;
    email: string;
    mobile: string;
    client_picture: string;
  }) {
    this.confirmService.confirm({
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message: `Are you sure you want to remove ${params.fullname} as co-maker?`,
      accept: () => {
        this.customerService.unlinkCustomerCoMaker(params.recno).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });

            this.extractCoMakerData(response);
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
      reject: () => {
        this.extractCoMakerData(this.customerData);
      },
    });
  }
}
