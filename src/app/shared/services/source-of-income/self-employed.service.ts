import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class SelfEmployedService {

  readonly http = inject(HttpService);

  addSelfEmployed(data: any) {
    return this.http.postRequest('income/self-employed', data);
  }

}
