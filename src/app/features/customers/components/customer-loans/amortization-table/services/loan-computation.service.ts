import { inject, Injectable } from '@angular/core';
import { PrincipalLoan, Transaction } from '../amortization-table.component';
import { LoanComputationDateDifferenceService, MODE_OF_PAYMENT } from './loan-computation-date-difference.service';

@Injectable({
  providedIn: 'root'
})
export class LoanComputationService {

  /* 
    TODO: Capital with interest computation on Bi-monthly 
    1. Get the upper or parent bracket of the transaction | Disregard the date and compute the interest based on the balance and capital [interest = [ capital x 3% + [ balance x 3% ] ] ].
    2. Compute the interest based on the balance of the upper bracket. 
    3. It must be compounded even theres is a lot of capital {pa dag dag}.
    4. Display the interest & other necessary information on the UI.
    ========================================================================================================================
    Make your life simple and easy to understand. Owen you are the best.
  */

  private computeDateDifference = inject(LoanComputationDateDifferenceService);
  /**
   * Calculates the interest accumulation for a given loan based on transaction data and loan details.
   *
   * @param {Transaction[]} transactionData - An array of transaction objects related to the loan.
   * @param {PrincipalLoan} loanData - An object containing details about the principal loan.
   * @returns {void}
   */
  calculateInterestAccumulation(transactionData: Transaction[], loanData: PrincipalLoan): void {
    const selectedIndex = this.findMostRecentApprovedIndex(transactionData);
    const { transaction_date } = transactionData[selectedIndex];
    const { loan_mode_of_payment, loan_interest_rate } = loanData;

    let interest = 0;

    const latestBalance = selectedIndex !== -1 ? transactionData[selectedIndex].balance : 0; // Get the latest balance from the transaction data array

    if (loan_mode_of_payment === MODE_OF_PAYMENT.BI_MONTHLY) {
      interest = this.computeBiMonthlyInterest(latestBalance, loan_interest_rate);
    } else if (loan_mode_of_payment === MODE_OF_PAYMENT.MONTHLY) {
      interest = this.computeMonthlyInterest(latestBalance, loan_interest_rate);
    }

    // Determine the interval between the transaction date and the current date
    const { days, months } = this.computeDateDifference.determineDateInterval(
      transaction_date,
      new Date(),
    );

    // Check if the loan is delinquent and accumulate interest accordingly
    if (this.checkDelinquencyStatus(days, months)) {
      const totalFifteenDaySegments = Math.floor((months * 30 + days) / 15); // Calculate the number of 15-day segments
      interest = totalFifteenDaySegments * this.computeBiMonthlyInterest(latestBalance, loan_interest_rate); // Accumulate interest based on the number of 15-day segments
    } else {
      if (loan_mode_of_payment === MODE_OF_PAYMENT.BI_MONTHLY) {
        interest = this.computeBiMonthlyInterest(latestBalance, loan_interest_rate); // Compute bi-monthly interest if the loan is not delinquent
      } else if (loan_mode_of_payment === MODE_OF_PAYMENT.MONTHLY) {
        interest = this.computeMonthlyInterest(latestBalance, loan_interest_rate); // Compute monthly interest if the loan is not delinquent
      }
    }

    console.table([
      { label: 'Interest', value: interest },
      { label: 'Mode of Payment', value: loan_mode_of_payment },
      { label: 'Loan Interest Rate', value: loan_interest_rate }
    ]);

  }

  /**
   * Computes the bi-monthly interest for a given loan balance and interest rate.
   *
   * @param balance - The current balance of the loan.
   * @param interestRate - The annual interest rate of the loan as a percentage.
   * @returns The bi-monthly interest amount.
   */
  private computeBiMonthlyInterest(balance: number, interestRate: number): number {
    return balance * (interestRate / 2 / 100);
  }

  /**
   * Computes the monthly interest for a given loan balance and interest rate.
   *
   * @param balance - The current balance of the loan.
   * @param interestRate - The annual interest rate of the loan as a percentage.
   * @returns The monthly interest amount.
   */
  private computeMonthlyInterest(balance: number, interestRate: number): number {
    return balance * (interestRate / 100);
  }

  /**
   * Checks if a loan is delinquent based on the number of days and months past due.
   *
   * @param days - The number of days past the due date.
   * @param month - The number of months past the due date.
   * @returns `true` if the loan is delinquent (more than 15 days and more than 1 month past due), otherwise `false`.
   */
  checkDelinquencyStatus(days: number, month: number): boolean {
    return days > 15 || month > 1;
  }

  /**
   * Finds the index of the most recent transaction with an 'APPROVED' status.
   *
   * @param transactionData - An array of transactions to search through.
   * @returns The index of the most recent transaction with an 'APPROVED' status, or -1 if no such transaction is found.
   */
  private findMostRecentApprovedIndex(transactionData: Transaction[]): number {
    return transactionData.findLastIndex(({ transaction_status }) => transaction_status === 'APPROVED');
  }


}
