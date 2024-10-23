import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { KeyFilterModule } from 'primeng/keyfilter';
import { AddressService } from '../../../../../../shared/services/address.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface AddressForm {
  customer_id: FormControl<string | null>;
  address_id?: FormControl<string | null>;
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

interface AddressData {
  customer_id: string;
  address_id: string;
  region: string;
  province: string;
  province_list: string[];
  city: string;
  city_list: string[];
  barangay: string;
  barangay_list: string[];
  street: string;
  zip_code: string;
  complete_address: string;
  landmark: string;
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    KeyFilterModule,
    TooltipModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    MessagesModule,
  ],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit, OnChanges {
  @Input({ required: false }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private geolocationService = inject(GeolocationService);
  private addressService = inject(AddressService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);

  regionList: { code: string; regionName: string }[] = [];

  addressForm: FormGroup<{ address: FormArray<FormGroup<AddressForm>> }> =
    new FormGroup({
      address: new FormArray<FormGroup<AddressForm>>([]),
    });

  ngOnInit(): void {
    this.fetchRegions();

    if (this.isEditMode) {
      return;
    }

    this.initializeAddressForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.syncCustomerAddress();
    }
  }

  syncCustomerAddress() {
    const address = this.customerData.cx_address;
    address.forEach(async (record: AddressData, index: number) => {
      this.onRegionChange(record.region, index);
      this.onProvinceChange(record.province, index);
      this.onCityChange(record.city, index);
      (this.addressForm.get('address') as FormArray).push(
        new FormGroup<AddressForm>({
          customer_id: new FormControl<string | null>(
            record.customer_id ?? null
          ),
          address_id: new FormControl<string | null>(record.address_id ?? null),
          region: new FormControl<string | null>(record.region ?? null),
          province: new FormControl<string | null>(record.province ?? null),
          province_list: new FormControl<string[] | null>(
            record.province_list ?? []
          ),
          city: new FormControl<string | null>(record.city ?? null),
          city_list: new FormControl<string[] | null>(record.city_list ?? null),
          barangay: new FormControl<string | null>(record.barangay ?? null),
          barangay_list: new FormControl<string[] | null>(
            record.barangay_list ?? null
          ),
          street: new FormControl<string | null>(record.street ?? null),
          zip_code: new FormControl<string | null>(record.zip_code ?? null),
          complete_address: new FormControl<string | null>(
            record.complete_address ?? null
          ),
          landmark: new FormControl<string | null>(record.landmark ?? null),
        })
      );
    });
  }

  initializeAddressForm() {
    (this.addressForm.get('address') as FormArray)?.push(
      this.buildAddressForm()
    );
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
    this.geolocationService.getRegions().subscribe({
      next: (regions) => {
        this.regionList = regions;
      },
    });
  }

  fetchProvinces(regionCode: string, index: number): void {
    this.geolocationService.getProvinces(regionCode).subscribe({
      next: (provinces) => {
        const provinceList = (
          this.addressForm.get('address') as FormArray
        ).controls[index].get('province_list');
        provinceList?.setValue(provinces);
        (this.addressForm.get('address') as FormArray).controls[index]
          .get('province')
          ?.enable();
        (this.addressForm.get('address') as FormArray).controls[index]
          .get('province')
          ?.addValidators([Validators.required]);
      },
    });
  }

  fetchCities(provinceCode: string, index: number): void {
    this.geolocationService.getCities(provinceCode).subscribe({
      next: (cities) => {
        const cityList = (
          this.addressForm.get('address') as FormArray
        ).controls[index].get('city_list');
        cityList?.setValue(cities);
      },
    });
  }

  fetchBarangays(cityCode: string, index: number): void {
    this.geolocationService.getBarangays(cityCode).subscribe({
      next: (barangays) => {
        const barangayList = (
          this.addressForm.get('address') as FormArray
        ).controls[index].get('barangay_list');
        barangayList?.setValue(barangays);
      },
    });
  }

  fetchNationalCapitalRegionCities(index: number): void {
    this.geolocationService.getNationalCapitalRegionCities().subscribe({
      next: (cities) => {
        const cityList = (
          this.addressForm.get('address') as FormArray
        ).controls[index].get('city_list');
        cityList?.setValue(cities);
        (this.addressForm.get('address') as FormArray).controls[index]
          .get('province')
          ?.disable();
        (this.addressForm.get('address') as FormArray).controls[index]
          .get('province')
          ?.removeValidators([Validators.required]);
      },
    });
  }

  getFormFieldValue(index: number, field: string): string {
    return (this.addressForm.get('address') as FormArray).controls[index].get(
      field
    )?.value;
  }

  getListOfProvinces(index: number): { code: string; provinceName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get(
      'province_list'
    )?.value;
  }

  getListOfCities(index: number): { code: string; cityName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get(
      'city_list'
    )?.value;
  }

  getListOfBarangays(index: number): { code: string; barangayName: string }[] {
    return (this.addressForm.get('address') as FormArray).controls[index].get(
      'barangay_list'
    )?.value;
  }

  private buildAddressForm(): FormGroup<AddressForm> {
    return new FormGroup<AddressForm>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
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
    });
  }

  addFormAddress() {
    (this.addressForm.get('address') as FormArray).push(
      this.buildAddressForm()
    );
  }

  removeFormAddress(index: number, addressId?: string) {
    if (this.isEditMode && addressId) {
      this.deleteAddressFromServer(addressId, index);
      return;
    }

    (this.addressForm.get('address') as FormArray).removeAt(index);
  }

  upsertCustomerAddress() {
    let { address } = this.addressForm.value;

    this.addressService
      .upsertCustomerAddress(
        this.addressService.formatAddress(address, this.regionList)
      )
      .subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
          });
          this.addressForm.disable();
        },
        error: (error: TypeError) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }

  submitForm() {
    if (this.isEditMode) {
      this.upsertCustomerAddress();
      return;
    }

    let { address } = this.addressForm.value;

    this.addressService
      .addCustomerAddress(
        this.addressService.formatAddress(address, this.regionList)
      )
      .subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
          });
          this.addressForm.disable();
        },
        error: (error: TypeError) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }

  deleteAddressFromServer(addressId: string, index: number) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.addressService.deleteCustomerAddress(addressId).subscribe({
          next: (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: data.message,
            });
            (this.addressForm.get('address') as FormArray).removeAt(index);
          },
          error: (error: TypeError) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
      },
    });
  }
}
