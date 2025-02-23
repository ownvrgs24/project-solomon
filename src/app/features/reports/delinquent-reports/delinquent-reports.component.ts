import { Component, inject, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { AccountDelinquencyData, PrintingExportService } from './services/printing-export.service';
import { DelinquentReportService } from './services/delinquent-report.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { GeolocationService } from '../../../shared/services/geolocation.service';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';

export interface Items {
  code: string
  name: string
}

interface FilterAddressForm {
  region: FormControl<string | null>;
  province: FormControl<string | null>;
  city: FormControl<string | null>;
  barangay: FormControl<string | null>;
}

interface CriteriaForm {
  selectedCriteria: FormControl<string | null>;
}

export enum DelinquentReportCriteria {
  ALL = 'all',
  BY_LOCATION = 'by_location',
}

export interface GeographicLocationMapping {
  code: string
  name: string
  oldName: string
  subMunicipalityCode: boolean
  cityCode: string
  municipalityCode: boolean
  districtCode: boolean
  provinceCode: string
  regionCode: string
  islandGroupCode: string
  psgc10DigitCode: string
}

@Component({
  selector: 'app-delinquent-reports',
  standalone: true,
  imports: [
    FieldsetModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    DividerModule,
    DropdownModule,
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
  ],
  templateUrl: './delinquent-reports.component.html',
  styleUrl: './delinquent-reports.component.scss',
  providers: []
})
export class DelinquentReportsComponent {

  private readonly userService = inject(PrintingExportService);
  private readonly service = inject(DelinquentReportService);
  private readonly geolocationService = inject(GeolocationService);

  private readonly enums = DelinquentReportCriteria;


  addressFilter: string | null = 'all';

  regionList: { code: string; regionName: string }[] = [];
  provinceList: { name: string; code: string }[] = [];
  cityList: { name: string; code: string }[] = [];
  barangayList: { name: string; code: string }[] = [];

  reportsFilterForm: FormGroup<FilterAddressForm> = new FormGroup({
    region: new FormControl<string | null>(null, [Validators.required]),
    province: new FormControl<string | null>(null, [Validators.required]),
    city: new FormControl<string | null>(null, [Validators.required]),
    barangay: new FormControl<string | null>(null, [Validators.required]),
  });

  criteriaForm: FormGroup<CriteriaForm> = new FormGroup({
    selectedCriteria: new FormControl("all", [Validators.required]),
  });

  delinquentReportCriteria: { value: string, label: string }[] = [
    { value: 'all', label: 'ALL DELINQUENT ACCOUNTS' },
    { value: 'by_location', label: 'BY LOCATION' },
  ];

  isDataLoading: boolean = false;
  filterTimeout: any;

  getDelinquentReport() {

    const { region, barangay, city, province } = this.reportsFilterForm.value;

    this.service.getDelinquentReport({
      code: null,
    }).subscribe({
      next: (response: any) => {
        this.userService.generateDelinquentReport(response.data as AccountDelinquencyData[]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.handleCriteriaChange({ value: this.enums.ALL } as DropdownChangeEvent);
  }

  handleCriteriaChange(event: DropdownChangeEvent) {
    switch (event.value) {
      case this.enums.ALL:
        this.reportsFilterForm.reset();
        this.reportsFilterForm.disable();
        break;
      case this.enums.BY_LOCATION:
        this.reportsFilterForm.enable();
        this.geolocationService.getRegions().subscribe({
          next: (regions) => this.regionList = regions,
          error: (error) => console.error('Error loading regions:', error)
        });
        break;
      default:
        break;
    }
  }


  onRegionChange(event: DropdownChangeEvent) {
    if (event.value === '130000000') {
      this.getNCRCities();
      this.reportsFilterForm.get('province')?.disable();
      return;
    };
    this.geolocationService.getProvinces(event.value).subscribe({
      next: (provinces) => {

        this.provinceList = provinces;

        this.reportsFilterForm.get('province')?.enable();
        this.reportsFilterForm.get('province')?.reset();
        this.reportsFilterForm.get('city')?.reset();
        this.reportsFilterForm.get('barangay')?.reset();
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceChange(event: DropdownChangeEvent) {
    this.geolocationService.getCities(event.value).subscribe({
      next: (cities) => {
        this.cityList = cities;
        this.reportsFilterForm.get('city')?.reset();
        this.reportsFilterForm.get('barangay')?.reset();
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  onCityChange(event: DropdownChangeEvent) {
    this.geolocationService.getBarangays(event.value).subscribe({
      next: (barangays) => {
        this.barangayList = barangays;
        this.reportsFilterForm.get('barangay')?.reset();
      },
      error: (error) => {
        console.error('Error loading barangays:', error);
      }
    });
  }

  getNCRCities() {
    this.geolocationService.getNationalCapitalRegionCities().subscribe({
      next: (cities) => {
        this.cityList = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  public get isValidAddressCriteria() {
    return this.criteriaForm.valid;
  }

  public get isValidAddressFilter() {
    return this.reportsFilterForm.valid;
  }

}
