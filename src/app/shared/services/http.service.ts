import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  protected BASE_URL: string = "http://localhost:8000";

  protected API_URL: string = `${this.BASE_URL}/api/`;

  // private BASE_URL: string = "https://api.dolbenlending.com/api/";
  // protected ROOT_URL: string = "https://api.dolbenlending.com/api/";

  // private BASE_URL: string = 'https://demoapi.dolbenlending.com/api/';

  readonly http = inject(HttpClient);

  uploadFile(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.API_URL + `upload/files`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  postRequest(apiEndpoint: string, data: any) {
    return this.http.post(this.API_URL + apiEndpoint, data, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  getRequest(apiEndpoint: string) {
    return this.http.get(this.API_URL + apiEndpoint, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  deleteRequest(apiEndpoint: string) {
    return this.http.delete(this.API_URL + apiEndpoint);
  }

  putRequest(apiEndpoint: string, data: any) {
    return this.http.put(this.API_URL + apiEndpoint, data);
  }

  get rootURL(): string {
    return this.BASE_URL;
  }



}
