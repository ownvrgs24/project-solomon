import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

/**
 * @description
 * Service to handle HTTP requests with authentication headers.
 * Provides methods for making GET, POST, PUT, DELETE requests and file uploads.
 *
 * @example
 * // Inject HttpService in a component or another service
 * constructor(private httpService: HttpService) {}
 *
 * // Make a GET request
 * this.httpService.getRequest('endpoint').subscribe(response => {
 *   console.log(response);
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  /**
   * Base URL for the API.
   */
  protected BASE_URL: string = 'http://localhost:8000';

  /**
   * URL for geolocation services.
   */
  protected GEOLOCATION_URL: string = 'http://localhost:3000/';

  /**
   * Full API URL constructed from the base URL.
   */
  protected API_URL: string = `${this.BASE_URL}/api/`;

  /**
   * Injected HttpClient instance.
   */
  readonly http = inject(HttpClient);

  /**
   * Injected UserService instance to get authentication token.
   */
  private readonly userService = inject(UserService);

  /**
   * Get authentication headers with the Bearer token.
   * @returns An object containing the headers with the Authorization token.
   */
  private getAuthHeaders() {
    const accessToken = this.userService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  }

  /**
   * Upload a file to the server.
   * @param formData - The form data containing the file to be uploaded.
   * @returns An observable of the HTTP event.
   */
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

  /**
   * Make a POST request to the specified API endpoint.
   * @param apiEndpoint - The API endpoint to send the request to.
   * @param data - The data to be sent in the request body.
   * @returns An observable of the HTTP response.
   */
  postRequest(apiEndpoint: string, data: any) {
    return this.http.post(this.API_URL + apiEndpoint, data, {
      reportProgress: true,
      responseType: 'json',
      ...this.getAuthHeaders()
    });
  }

  /**
   * Make a GET request to the specified API endpoint.
   * @param apiEndpoint - The API endpoint to send the request to.
   * @returns An observable of the HTTP response.
   */
  getRequest(apiEndpoint: string) {
    return this.http.get(this.API_URL + apiEndpoint, {
      reportProgress: true,
      responseType: 'json',
      ...this.getAuthHeaders()
    });
  }

  /**
   * Make a DELETE request to the specified API endpoint.
   * @param apiEndpoint - The API endpoint to send the request to.
   * @returns An observable of the HTTP response.
   */
  deleteRequest(apiEndpoint: string) {
    return this.http.delete(this.API_URL + apiEndpoint, {
      ...this.getAuthHeaders()
    });
  }

  /**
   * Make a PUT request to the specified API endpoint.
   * @param apiEndpoint - The API endpoint to send the request to.
   * @param data - The data to be sent in the request body.
   * @returns An observable of the HTTP response.
   */
  putRequest(apiEndpoint: string, data: any) {
    return this.http.put(this.API_URL + apiEndpoint, data, {
      ...this.getAuthHeaders()
    });
  }

  /**
   * Get the root URL of the API.
   * @returns The base URL as a string.
   */
  get rootURL(): string {
    return this.BASE_URL;
  }

  /**
   * Get the geolocation service URL.
   * @returns The geolocation URL as a string.
   */
  get geolocationURL(): string {
    return this.GEOLOCATION_URL;
  }
}
