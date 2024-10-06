import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Customer } from '../../features/customers/components/customer-list/customer-list.component';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {


  readonly http = inject(HttpService);

  fetchCustomers() {
    return this.http.getRequest('customers');
  }

  registerCustomer(data: any) {
    return this.http.postRequest('customers', data);
  }

}
``