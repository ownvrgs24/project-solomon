import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  setLocalStorage(key: string, value: any) {
    const encryptedValue = btoa(JSON.stringify(value));
    localStorage.setItem(key, encryptedValue);
  }

  getLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(atob(item));
    }
    return {};
  }


}
