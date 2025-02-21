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
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { finalize, Observable } from 'rxjs';

export interface Items {
  code: string
  name: string
}

interface FilterAddressForm {
  selected_item: FormControl<string | null>;
}

interface CriteriaForm {
  address: FormControl<string | null>;
}

export enum DelinquentReportCriteria {
  ALL = 'all',
  REGION = 'region',
  PROVINCE = 'province',
  CITY = 'city',
  BARANGAY = 'barangay'
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

  itemList: Items[] = [];
  filteredItems: any[] = [];

  addressFilter: string | null = 'all';


  reportsFilterForm: FormGroup<FilterAddressForm> = new FormGroup({
    selected_item: new FormControl<string | null>(null),
  });

  criteriaForm: FormGroup<CriteriaForm> = new FormGroup({
    address: new FormControl("all", [Validators.required]),
  });

  delinquentReportCriteria: { value: string, label: string }[] = [
    { value: 'all', label: 'ALL DELINQUENT ACCOUNTS' },
    { value: 'region', label: 'REGION' },
    { value: 'province', label: 'PROVINCE' },
    { value: 'city', label: 'CITY' },
    { value: 'barangay', label: 'BARANGAY' },
  ];

  isDataLoading: boolean = false;
  filterTimeout: any;

  getDelinquentReport() {

    const { selected_item } = this.reportsFilterForm.value;

    this.service.getDelinquentReport({
      code: selected_item,
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
    // Clear previous items
    this.itemList = [];

    // Reset autocomplete field
    const autoCompleteControl = this.reportsFilterForm.get('selected_item');
    if (autoCompleteControl) {
      autoCompleteControl.setValue(null);
    }

    switch (event.value) {
      case this.enums.REGION:
        this.loadData(this.geolocationService.getRegionsStatic());
        break;
      case this.enums.PROVINCE:
        this.loadData(this.geolocationService.getProvincesStatic());
        break;
      case this.enums.CITY:
        this.loadData(this.geolocationService.getCitiesStatic());
        break;
      case this.enums.BARANGAY:
        this.loadData(this.geolocationService.getBarangaysStatic());
        break;
      default:
        this.reportsFilterForm.reset();
        this.reportsFilterForm.disable();
    }
  }

  private loadData(service: Observable<any>) {
    this.isDataLoading = true;
    service.pipe(
      finalize(() => this.isDataLoading = false)
    ).subscribe({
      next: (response) => this.itemList = response,
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  filterItemsByDropdown(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase().trim();

    // Debounce for large datasets
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filteredItems = this.itemList?.filter(item => {
        const itemName = item.name.toLowerCase();
        // Check if any word in item name starts with query
        return itemName.split(' ').some(word =>
          word.startsWith(query)
        );
      }).slice(0, 100) || []; // Limit results
    }, 300);
  }

}
