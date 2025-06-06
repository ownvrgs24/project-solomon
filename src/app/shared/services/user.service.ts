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
    return null;
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  setSession(data: any) {
    this.setLocalStorage('user', data);
  }

  getSession() {
    return this.getLocalStorage('user');
  }

  removeSession() {
    this.removeLocalStorage('user');
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  getUserRole() {
    return this.getSession()?.role;
  }

  getUserName() {
    return this.getSession()?.user_name;
  }

  getAccountId() {
    return this.getSession()?.account_id;
  }

  getFullName() {
    return this.getSession()?.full_name;
  }

  getEmail() {
    return this.getSession()?.email_address;
  }

  getToken() {
    return this.getSession()?.token;
  }

}
