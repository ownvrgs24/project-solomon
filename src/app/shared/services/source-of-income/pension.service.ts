import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class PensionService {

  readonly http = inject(HttpService);

  addPension(data: any) {
    return this.http.postRequest('income/pension', data);
  }
}
