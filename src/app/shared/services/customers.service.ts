import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {


  readonly http = inject(HttpService);

  fetchCustomers() {
    return this.http.getRequest('customers');
  }

}
``