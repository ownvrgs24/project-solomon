import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CustomersService } from '../../../../../../../shared/services/customers.service';
import { Customer } from '../../../../customer-list/customer-list.component';
import { StatusTagService } from '../../../../../../../shared/services/status-tag.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { AvatarModule } from 'primeng/avatar';
import { HttpService } from '../../../../../../../shared/services/http.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    TableModule,
    IconFieldModule,
    FormsModule,
    InputIconModule,
    InputTextModule,
    CommonModule,
    TagModule,
    UpperCaseInputDirective,
    ButtonModule,
    TooltipModule,
    RouterModule,
    MessagesModule,
    AvatarModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent {
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;
  @Input({ required: true }) customerId!: string | null;
  @Output() selectedCustomer = new EventEmitter<any>(); // TODO: Define the type of the emitted value

  private readonly customerService = inject(CustomersService);
  public readonly statusTagService = inject(StatusTagService);
  private readonly messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);
  protected readonly http = inject(HttpService);

  loading: boolean = true;
  customers: Customer[] = [];
  searchValue!: string;

  ngOnInit(): void {
    this.fetchActiveCustomers();
  }

  fetchActiveCustomers(): void {
    this.customerService.fetchCustomerByStatus('ACTIVE').subscribe({
      next: (data) => {
        this.loading = true;
        this.customers = data as Customer[];
        this.customers = this.customers.map((customer) => {
          return {
            ...customer,
            client_picture: `${this.http.rootURL}/${customer.client_picture}`,
            address: customer.cx_address
              .map((address) => address.complete_address)
              .join(', '),
          };
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  selectAsComaker(customer_id: string) {
    this.confirmService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      message: 'Do you want to link this customer as a co-maker?',
      accept: () => {
        this.customerService
          .linkCustomerCoMaker({
            customer_id: this.customerId || this.customerData?.customer_id,
            comaker_id: customer_id,
          })
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
              });
              if (this.isEditMode) {
                this.selectedCustomer.emit(response);
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error,
              });
            },
          });
      },
    });
  }
}
