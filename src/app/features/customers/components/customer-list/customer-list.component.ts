import { Component, inject, Inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CustomersService } from '../../../../shared/services/customers.service';
import { IconFieldModule } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { UpperCaseInputDirective } from '../../../../shared/directives/to-uppercase.directive';


export interface Customer {
  recno: number
  customer_id: string
  first_name: string
  middle_name: any
  last_name: string
  extension_name: any
  gender: string
  civil_status: string
  mobile_number: string
  telephone_number: any
  email_address: string
  client_picture: any
  date_of_birth: string
  client_status: string
  cmk_status: any
  date_marked_as_delinquent: any
  created_at: string
  updated_at: string
  cx_address: {
    complete_address: string;
  }[];
  comakers_array?: {
    first_name: string
    middle_name: string
    last_name: string
    extension_name: string;
  }[],
  comakers?: string;
  address?: string;
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [TableModule, IconFieldModule, FormsModule, InputIconModule, InputTextModule, CommonModule, TagModule, UpperCaseInputDirective],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
  providers: [CustomersService]
})
export class CustomerListComponent {

  getSeverity(status: any): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'FOR REVIEW':
        return 'warning';
      case 'DELINQUENT':
        return 'danger';
      default:
        return undefined;
    }
  }

  readonly customerService = inject(CustomersService);
  loading: boolean = true;

  customers: Customer[] = [];

  ngOnInit(): void {
    this.fetchCustomers();
  }

  searchValue!: string;


  fetchCustomers() {
    this.customerService.fetchCustomers().subscribe((data) => {
      this.loading = true;
      this.customers = data as Customer[];
      this.customers = this.customers.map((customer) => {
        return {
          ...customer,
          client_status: customer.client_status.replace(/_/g, ' ').toUpperCase(),
          client_status_severity: this.getSeverity(customer.client_status),
          address: customer.cx_address.map((address) => address.complete_address).join(', '),
          comakers: customer.comakers_array?.map((comaker) => {
            return `${comaker.first_name} ${comaker.middle_name} ${comaker.last_name} ${comaker.extension_name}`;
          }).join(', ')
        };
      });


      this.loading = false;
    });
  }
}
