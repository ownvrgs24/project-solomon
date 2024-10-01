import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { GeolocationService } from '../../../../../../shared/services/geolocation.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { UpperCaseInputDirective } from '../../../../../../shared/directives/to-uppercase.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

interface AddressForm {
  customer_id: FormControl<string | null>;
  region: FormControl<string | null>;
  province: FormControl<string | null>;
  province_list: FormControl<string[] | null>;
  city: FormControl<string | null>;
  city_list: FormControl<string[] | null>;
  barangay: FormControl<string | null>;
  barangay_list: FormControl<string[] | null>;
  street: FormControl<string | null>;
  zip_code: FormControl<string | null>;
  complete_address: FormControl<string | null>;
  landmark: FormControl<string | null>;
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownModule, TooltipModule, InputNumberModule, AsyncPipe, CommonModule, ButtonModule, DividerModule, InputTextModule, FieldsetModule, UpperCaseInputDirective],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  // TODO: Remove the placeholder from the forms 

  private geolocationService = inject(GeolocationService);

  regionList: { code: string; regionName: string }[] = [];

  addressForm: FormGroup<{ address: FormArray<FormGroup<AddressForm>> }> = new FormGroup({
    address: new FormArray([
      new FormGroup<AddressForm>({
        customer_id: new FormControl<string | null>('1', [Validators.required]),
        region: new FormControl<string | null>(null, [Validators.required]),
        province: new FormControl<string | null>(null, [Validators.required]),
        province_list: new FormControl<string[]>([]),
        city: new FormControl<string | null>(null, [Validators.required]),
        city_list: new FormControl<string[]>([]),
        barangay: new FormControl<string | null>(null, [Validators.required]),
        barangay_list: new FormControl<string[]>([]),
        street: new FormControl<string | null>(null, [Validators.required]),
        zip_code: new FormControl<string | null>(null, [Validators.required]),
        complete_address: new FormControl<string | null>(null),
        landmark: new FormControl<string | null>(null),
      })
    ], [Validators.required])
  });

  ngOnInit(): void {
    this.fetchRegions();
  }

  onRegionChange(code: string, index: number) {
    if (code === '130000000') this.fetchNationalCapitalRegionCities(index);
    else this.fetchProvinces(code, index);
  }

  onProvinceChange(code: string, index: number) {
    this.fetchCities(code, index);
  }

  onCityChange(code: string, index: number) {
    this.fetchBarangays(code, index);
  }

  fetchRegions(): void {
    this.geolocationService.getRegions()
      .subscribe({
        next: (regions) => { this.regionList = regions },
        complete() { console.log('Regions fetched...') }
      });
  }

  fetchProvinces(regionCode: string, index: number): void {
    this.geolocationService.getProvinces(regionCode)
      .subscribe({
        next: (provinces) => {
          const provinceList = (this.addressForm.get('address') as FormArray).controls[index].get('province_list');
          provinceList?.setValue(provinces);
          (this.addressForm.get('address') as FormArray).controls[index].get('province')?.enable();
          (this.addressForm.get('address') as FormArray).controls[index].get('province')?.addValidators([Validators.required]);
        },
        complete() { console.log('Provinces fetched...') }
      });
  }

  fetchCities(provinceCode: string, index: number): void {
    this.geolocationService.getCities(provinceCode)
      .subscribe({
        next: (cities) => {
          const cityList = (this.addressForm.get('address') as FormArray).controls[index].get('city_list');
          cityList?.setValue(cities);
        },
        complete() { console.log('Cities fetched...') }
      });
  }

  fetchBarangays(cityCode: string, index: number): void {
    this.geolocationService.getBarangays(cityCode)
      .subscribe({
        next: (barangays) => {
          const barangayList = (this.addressForm.get('address') as FormArray).controls[index].get('barangay_list');
          barangayList?.setValue(barangays);
        },
        complete() { console.log('Barangays fetched...') }
      });
  }

  fetchNationalCapitalRegionCities(index: number): void {
    this.geolocationService.getNationalCapitalRegionCities()
      .subscribe({
        next: (cities) => {
          const cityList = (this.addressForm.get('address') as FormArray).controls[index].get('city_list');
          cityList?.setValue(cities);
          (this.addressForm.get('address') as FormArray).controls[index].get('province')?.disable();
          (this.addressForm.get('address') as FormArray).controls[index].get('province')?.removeValidators([Validators.required]);
        },
        complete: () => { console.log('NCR Cities fetched...'); }
      });
  }

  getFormFieldValue(index: number, field: string): string {
    return (this.addressForm.get('address') as FormArray).controls[index].get(field)?.value;
  }

  getListOfProvinces(index: number): { code: string; provinceName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get('province_list')?.value;
  }

  getListOfCities(index: number): { code: string; cityName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get('city_list')?.value;
  }

  getListOfBarangays(index: number): { code: string; barangayName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get('barangay_list')?.value;
  }

  addAddressForm() {
    (this.addressForm.get('address') as FormArray).push(new FormGroup<AddressForm>({
      customer_id: new FormControl<string | null>('1', [Validators.required]),
      region: new FormControl<string | null>(null, [Validators.required]),
      province: new FormControl<string | null>(null, [Validators.required]),
      province_list: new FormControl<string[]>([]),
      city: new FormControl<string | null>(null, [Validators.required]),
      city_list: new FormControl<string[]>([]),
      barangay: new FormControl<string | null>(null, [Validators.required]),
      barangay_list: new FormControl<string[]>([]),
      street: new FormControl<string | null>(null, [Validators.required]),
      zip_code: new FormControl<string | null>(null, [Validators.required]),
      complete_address: new FormControl<string | null>(null),
      landmark: new FormControl<string | null>(null),
    }));
  }

  removeFormAddress(index: number) {
    // TODO: Add a confirmation dialog before removing the form address
    (this.addressForm.get('address') as FormArray).removeAt(index);
  }
}
