import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  readonly http = inject(HttpService);

  deleteCustomerAddress(id: any) {
    return this.http.deleteRequest(`address/${id}`);
  }

  addCustomerAddress(data: any) {
    return this.http.postRequest('address', data);
  }

  upsertCustomerAddress(data: any) {
    return this.http.putRequest('address', data);
  }

  formatAddress(address: any, regionList: any) {
    return address?.map((address: any) => {
      return {
        customer_id: address.customer_id,
        address_id: address.address_id || null,
        region: address.region,
        province: address.province,
        city: address.city,
        barangay: address.barangay,
        street: address.street,
        zip_code: address.zip_code,
        landmark: address.landmark,
        complete_address: [
          address.street,
          (
            address.barangay_list as unknown as { code: string; name: string }[]
          )?.filter((element: { code: string; name: string }) => {
            return element.code === address.barangay ? element.name : '';
          })[0].name,

          (
            address.city_list as unknown as { code: string; name: string }[]
          )?.filter((element: { code: string; name: string }) => {
            return element.code === address.city ? element.name : '';
          })[0].name,

          (
            address.province_list as unknown as { code: string; name: string }[]
          )?.filter((element: { code: string; name: string }) => {
            return element.code === address.province ? element.name : '';
          })[0].name,

          (
            regionList as unknown as { code: string; regionName: string }[]
          )?.filter((element: { code: string; regionName: string }) => {
            return element.code === address.region ? element.regionName : '';
          })[0].regionName,

          address.zip_code,
        ]
          .join(' ')
          .toUpperCase()
          .trim(),
      };
    });
  }
}
