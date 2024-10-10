import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private http = inject(HttpService);

  addItem(data: any) {
    return this.http.postRequest('collateral/item', data);
  }
}
