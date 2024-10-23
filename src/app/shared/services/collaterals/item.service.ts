import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpService);

  deleteItem(id: string) {
    return this.http.deleteRequest(`collateral/item/${id}`);
  }

  addItem(data: any) {
    return this.http.postRequest('collateral/item', data);
  }

  updateItem(data: any) {
    return this.http.putRequest('collateral/item', data);
  }
}
