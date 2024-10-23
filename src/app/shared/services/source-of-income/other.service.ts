import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class OtherService {
  readonly http = inject(HttpService);

  addOther(data: any) {
    return this.http.postRequest('income/other-source-of-income', data);
  }

  updateOther(data: any) {
    return this.http.putRequest('income/other-source-of-income', data);
  }
}
