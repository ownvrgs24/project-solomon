import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AtmCardComponent } from "./atm-card/atm-card.component";
import { BankCheckComponent } from "./bank-check/bank-check.component";
import { HouseAndLotComponent } from "./house-and-lot/house-and-lot.component";
import { LotComponent } from "./lot/lot.component";
import { ItemsComponent } from "./items/items.component";
import { VehicleComponent } from "./vehicle/vehicle.component";
import { OthersComponent } from "./others/others.component";

@Component({
  selector: 'app-shell-collaterals-form',
  standalone: true,
  imports: [TabViewModule, CommonModule, AtmCardComponent, BankCheckComponent, HouseAndLotComponent, LotComponent, ItemsComponent, VehicleComponent, OthersComponent],
  templateUrl: './shell-collaterals-form.component.html',
  styleUrl: './shell-collaterals-form.component.scss'
})
export class ShellCollateralsFormComponent {
  tabs: { title: string, value: string }[] = [
    { title: 'Atm Card', value: 'atm_card' },
    { title: 'Bank Check', value: 'bank_check' },
    { title: 'House And Lot', value: 'house_and_lot' },
    { title: 'Lot', value: 'lot' },
    { title: 'Item', value: 'item' },
    { title: 'Vehicle', value: 'vehicle' },
    { title: 'Others', value: 'others' }
  ];


}