import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { GeographicLocationMapping } from '../../features/reports/delinquent-reports/delinquent-reports.component';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  getRegions(): Observable<{ code: string; regionName: string }[]> {
    return this.http.get<{ code: string; regionName: string }[]>(
      `${this.httpService.geolocationURL}regions`
    );
  }

  getProvinces(
    regionCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}regions/${regionCode}/provinces`
    );
  }

  getCities(
    provinceCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}provinces/${provinceCode}/cities-municipalities`
    );
  }

  // This is for NCR only
  getNationalCapitalRegionCities(): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}regions/130000000/cities-municipalities`
    );
  }

  getBarangays(
    cityCode: string
  ): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}cities-municipalities/${cityCode}/barangays`
    );
  }

  // Static data for the dropdowns in the form

  getRegionsStatic(): Observable<{ code: string; regionName: string }[]> {
    return this.http.get<{ code: string; regionName: string }[]>(
      `${this.httpService.geolocationURL}regions`
    );
  }

  getProvincesStatic(): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}provinces`
    );
  }

  getCitiesStatic(): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}cities-municipalities`
    );
  }

  getBarangaysStatic(): Observable<{ name: string; code: string }[]> {
    return this.http.get<{ name: string; code: string }[]>(
      `${this.httpService.geolocationURL}barangays`
    );
  }


  getRegionByCode(code: string): Observable<{ code: string; regionName: string }> {
    return this.http.get<{ code: string; regionName: string }>(
      `${this.httpService.geolocationURL}regions/${code}`
    );
  }

  getProvinceByCode(code: string): Observable<GeographicLocationMapping> {
    return this.http.get<GeographicLocationMapping>(
      `${this.httpService.geolocationURL}provinces/${code}`
    );
  }

  getCityAndMunicipalityByCode(code: string): Observable<GeographicLocationMapping> {
    return this.http.get<GeographicLocationMapping>(
      `${this.httpService.geolocationURL}cities-municipalities/${code}`
    );
  }

  getBarangayByCode(code: string): Observable<GeographicLocationMapping> {
    return this.http.get<GeographicLocationMapping>(
      `${this.httpService.geolocationURL}barangays/${code}`
    );
  }
}
