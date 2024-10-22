import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class EmploymentService {
  readonly http = inject(HttpService);

  addEmployment(data: any) {
    return this.http.postRequest('income/employment', data);
  }
}
