import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CustomersService } from '../../../../shared/services/customers.service';
import { IconFieldModule } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { UpperCaseInputDirective } from '../../../../shared/directives/to-uppercase.directive';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { StatusTagService } from '../../../../shared/services/status-tag.service';
import { HttpService } from '../../../../shared/services/http.service';
import { AvatarModule } from 'primeng/avatar';

export interface Customer {
  recno: number;
  customer_id: string;
  first_name: string;
  middle_name: any;
  last_name: string;
  extension_name: any;
  gender: string;
  civil_status: string;
  mobile_number: string;
  telephone_number: any;
  email_address: string;
  client_picture: any;
  date_of_birth: string;
  client_status: string;
  cmk_status: any;
  date_marked_as_delinquent: any;
  created_at: string;
  updated_at: string;
  cx_address: {
    complete_address: string;
  }[];
  co_makers: {
    customer_id: string;
    comaker_id: string;
    cx_detail: Customer;
  }[];
  address?: string;
  fixed_co_maker?: string[];
}

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
    AvatarModule,
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
  providers: [CustomersService],
})
export class CustomerListComponent {
  private readonly customerService = inject(CustomersService);
  private readonly http = inject(HttpService);
  public readonly statusTagService = inject(StatusTagService);

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
          client_picture: `${this.http.rootURL}/${customer.client_picture}`,
          address: customer.cx_address
            .map((address) => address.complete_address)
            .join(', '), // join the address array
          fixed_co_maker: customer.co_makers?.map((comaker) => {
            return `${comaker.cx_detail.last_name ?? ''}, 
              ${comaker.cx_detail.first_name ?? ''} 
              ${comaker.cx_detail.middle_name ?? ''} 
              ${comaker.cx_detail.extension_name ?? ''}`.trim();
          }),
        };
      });

      this.loading = false;
    });
  }
}
