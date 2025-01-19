import { inject, Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';
import {
  ActualInterestData,
  PrincipalLoan,
  Transaction,
} from '../../../features/customers/components/customer-loans/amortization-table/amortization-table.component';

export enum MODE_OF_PAYMENT {
  BI_MONTHLY = 'BI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

@Injectable({
  providedIn: 'root',
})
export class LoanInterestCalculatorService {

  protected readonly interestRateFactor: number = 0.005;
  private: typeof MODE_OF_PAYMENT = MODE_OF_PAYMENT;

  computeLoanInterest(loanData: PrincipalLoan, transactionData: Transaction[]) {
    let latestAccountBalance: number = 0;
    let currentCapitalInterest: number = 0;
    let activeDataIndex: number = 0;

    // This loop will get the latest balance of the client and the index of the latest balance
    for (let index = transactionData.length - 1; index >= 0; index--) {
      const { transaction_status, loan_status } = transactionData[index];
      if (transaction_status === "APPROVED" || loan_status === "APPROVED") {
        latestAccountBalance = transactionData[index].balance;
        activeDataIndex = index;
        break;
      }
    }
    // end of loop

    // Get the interest within the capital
    let interestWithinCapital: number = 0;
    if (this.validateTransactionParity(transactionData)) {
      for (let index = transactionData.length - 1; index >= 0; index--) {
        const { transaction_status, loan_status } =
          transactionData[index];
        if (transaction_status === "APPROVED" || loan_status === "APPROVED") {
          // Check if the capital is greater than 0
          if (transactionData[index].capital === 0) break;
          // Add the capital to the capitalSum
          interestWithinCapital += transactionData[index].capital;
        }
      }
      // Sum the projected interest and the interest within the capital
      currentCapitalInterest = interestWithinCapital * (loanData.loan_interest_rate * this.interestRateFactor);

      // const projectedInterest = currentCapitalInterest + interest;

    }
  }

  validateTransactionParity(data: Transaction[]): boolean {
    let indexCounter = 0;
    for (let index = 0; index < data.length; index++) {
      /* If the interest is greater than 0, increment the indexCounter
      This will indicate that customer is paid for the month */
      if (data[index].payment > 0) {
        indexCounter++;
      }
    }
    return indexCounter % 2 != 0;
  }



}
