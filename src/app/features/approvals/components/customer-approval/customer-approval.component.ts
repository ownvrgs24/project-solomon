import { Component, inject, OnInit } from '@angular/core';
import { CustomersService } from '../../../../shared/services/customers.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { UpperCaseInputDirective } from '../../../../shared/directives/to-uppercase.directive';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { Customer } from '../../../customers/components/customer-list/customer-list.component';
import { HttpService } from '../../../../shared/services/http.service';
import { StatusTagService } from '../../../../shared/services/status-tag.service';
import { ConfirmationService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-customer-approval',
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
    AvatarModule,
    FieldsetModule,
  ],
  templateUrl: './customer-approval.component.html',
  styleUrl: './customer-approval.component.scss',
  providers: [CustomersService]
})
export class CustomerApprovalComponent implements OnInit {
  private readonly customerService = inject(CustomersService);
  public readonly statusTagService = inject(StatusTagService);
  private readonly http = inject(HttpService);
  private readonly confirmationService = inject(ConfirmationService);

  loading: boolean = true;
  customers: Customer[] = [];
  searchValue!: string;

  ngOnInit(): void {
    this.getCustomerForReview();
  }

  getCustomerForReview(): void {
    this.customerService.fetchCustomerByStatus('FOR_REVIEW').subscribe({
      next: (res) => {
        this.loading = true;
        this.customers = res as Customer[];
        this.customers = this.customers.map((customer) => {
          return {
            ...customer,
            client_picture: `${this.http.rootURL}/${customer.client_picture}`,
            address: customer.cx_address
              .map((address) => address.complete_address)
              .join(', '),
            fixed_co_maker: customer.co_makers?.map((comaker) => {
              return `${comaker.cx_detail.last_name ?? ''}, 
                ${comaker.cx_detail.first_name ?? ''} 
                ${comaker.cx_detail.middle_name ?? ''} 
                ${comaker.cx_detail.extension_name ?? ''}`.trim();
            }),
          };
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching customers:', err);
      }
    });
  }

  private updateCustomerStatus(customer_id: string, status: 'ACTIVE' | 'REJECTED') {
    const actionText = status === 'ACTIVE' ? 'approve' : 'reject';
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionText} this customer?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: () => {
        this.customerService.updateCustomerStatus({
          customer_id,
          client_status: status
        }).subscribe({
          next: () => {
            this.getCustomerForReview();
          },
          error: (err) => {
            console.error(`Failed to ${actionText} customer:`, err);
          }
        });
      }
    });
  }

  approveCustomer(customer_id: string) {
    this.updateCustomerStatus(customer_id, 'ACTIVE');
  }

  approveAllCustomers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve all customers?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-danger p-button-text',
      accept: () => {
        this.loading = true;
        const approvalPromises = this.customers.map(customer =>
          firstValueFrom(this.customerService.updateCustomerStatus({
            customer_id: customer.customer_id,
            client_status: 'ACTIVE'
          }))
        );

        Promise.all(approvalPromises)
          .then(() => {
            this.getCustomerForReview();
          })
          .catch(err => {
            console.error('Failed to approve all customers:', err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    });
  }
}
