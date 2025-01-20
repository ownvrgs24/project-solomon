import { inject, Injectable } from '@angular/core';



export enum MODE_OF_PAYMENT {
  BI_MONTHLY = 'BI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

@Injectable({
  providedIn: 'root',
})
export class LoanInterestCalculatorService {

}
