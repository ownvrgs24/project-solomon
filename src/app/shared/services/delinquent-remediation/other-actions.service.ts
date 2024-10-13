import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class OtherActionsService {

  readonly http = inject(HttpService);

  addOtherAction(data: any) {
    return this.http.postRequest(`remediation/other-actions`, data);
  }
}
