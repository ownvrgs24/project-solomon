import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Customer } from '../../features/customers/components/customer-list/customer-list.component';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  readonly http = inject(HttpService);

  fetchCustomers() {
    return this.http.getRequest('customers');
  }

  fetchCustomerById(id: string) {
    return this.http.getRequest(`customer/${id}`);
  }

  updateCustomerPersonalData(data: any) {
    return this.http.putRequest('customer/update', data);
  }

  registerCustomer(data: any) {
    return this.http.postRequest('customers', data);
  }

  linkCustomerCoMaker(data: any) {
    return this.http.postRequest(`customer/link`, data);
  }

  unlinkCustomerCoMaker(id: number) {
    return this.http.deleteRequest(`customer/unlink/${id}`);
  }

  markAsDelinquent(data: any) {
    return this.http.postRequest(`customer/mark-as-delinquent`, data);
  }

  fetchCustomerByStatus(status: string) {
    return this.http.getRequest(`customers/${status}`);
  }

  updateCustomerSignatoryArrangement(data: any) {
    return this.http.putRequest(`customer/update-signatory-arrangement`, data);
  }
}
