import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  getRegions(): Observable<{ code: string; regionName: string }[]> {
    return this.http.get<{ code: string; regionName: string }[]>(
      "https://psgc.gitlab.io/api/regions"
    );
  }

  getProvinces(
    regionCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `https://psgc.gitlab.io/api/regions/${regionCode}/provinces`
    );
  }

  getCities(
    provinceCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`
    );
  }

  // This is for NCR only
  getNationalCapitalRegionCities(): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities`
    );
  }

  getBarangays(
    cityCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`
    );
  }
}
