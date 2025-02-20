import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  protected BASE_URL: string = 'https://gzzv9ww4-8000.asse.devtunnels.ms';

  protected API_URL: string = `${this.BASE_URL}/api/`;

  // private BASE_URL: string = "https://api.dolbenlending.com/api/";
  // protected ROOT_URL: string = "https://api.dolbenlending.com/api/";

  // private BASE_URL: string = 'https://demoapi.dolbenlending.com/api/';

  readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);

  private getAuthHeaders() {
    const accessToken = this.userService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  }
  
  uploadFile(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest(
      'POST',
      this.API_URL + `upload/files`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.userService.getToken()}`
        })
      }
    );
    return this.http.request(req);
  }

  postRequest(apiEndpoint: string, data: any) {
    return this.http.post(this.API_URL + apiEndpoint, data, {
      reportProgress: true,
      responseType: 'json',
      ...this.getAuthHeaders()
    });
  }

  getRequest(apiEndpoint: string) {
    return this.http.get(this.API_URL + apiEndpoint, {
      reportProgress: true,
      responseType: 'json',
      ...this.getAuthHeaders()
    });
  }

  deleteRequest(apiEndpoint: string) {
    return this.http.delete(this.API_URL + apiEndpoint, {
      ...this.getAuthHeaders()
    });
  }

  putRequest(apiEndpoint: string, data: any) {
    return this.http.put(this.API_URL + apiEndpoint, data, {
      ...this.getAuthHeaders()
    });
  }

  get rootURL(): string {
    return this.BASE_URL;
  }
}
