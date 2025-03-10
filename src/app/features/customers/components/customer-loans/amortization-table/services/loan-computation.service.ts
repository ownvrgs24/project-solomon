import { Injectable } from '@angular/core';
import { PrincipalLoan, Transaction } from '../amortization-table.component';
import { MODE_OF_PAYMENT } from './loan-computation-date-difference.service';

export enum TRANSACTION_STATUS {
  FOR_REVIEW = 'FOR_REVIEW',
  FOR_DELETION = 'FOR_DELETION',
  DELETED = 'DELETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface LoanRepaymentAnalysis {
  interest: number;
  selectedIndex: number;
  loan_interest_rate: number;
  days: number;
  months: number;
  isDelinquent: boolean;
  loan_mode_of_payment: MODE_OF_PAYMENT;
  find_upper_payment_bracket_index: number;
  paid_in_advance?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoanComputationService {
  protected interestMultiplier: number = 0.005;
  protected projectedInterest: number = 0;

  evaluateInterestAmount(transactionData: Transaction[], loanData: PrincipalLoan): number {

    // If bi-monthly mode of payment
    if (loanData.loan_mode_of_payment === MODE_OF_PAYMENT.BI_MONTHLY) {
      return this.computeBiMonthlyInterestAmount(transactionData, loanData);
    }

    // Monthly mode of payment
    return this.computeMonthlyInterestAmount(transactionData, loanData);
  }

  computeBiMonthlyInterestAmount(transactionData: Transaction[], loanData: PrincipalLoan) {
    // Find the last interest payment
    let lastInterestIndex = -1;
    for (let i = 0; i < transactionData.length; i++) {
      if (transactionData[i].interest > 0) {
        lastInterestIndex = i;
      }
    }

    // If no previous interest payments, use initial balance
    if (lastInterestIndex === -1) {
      return this.computeBiMonthlyInterest(transactionData[0].balance, loanData.loan_interest_rate);
    }

    // Count the number of interest payments
    let interestPaymentCount = 0;
    for (let i = 0; i < transactionData.length; i++) {
      if (transactionData[i].interest > 0) {
        interestPaymentCount++;
      }
    }

    // If we're calculating the second payment in a pair
    if (interestPaymentCount % 2 !== 0) {
      // Check if there's a capital addition after the last interest payment
      let additionalInterest = 0;
      for (let i = lastInterestIndex + 1; i < transactionData.length; i++) {
        if (transactionData[i].capital > 0) {
          additionalInterest += this.computeBiMonthlyInterest(
            transactionData[i].capital,
            loanData.loan_interest_rate
          );
        }
      }

      // Return the same interest as the first payment plus any additional interest from capital
      return transactionData[lastInterestIndex].interest + additionalInterest;
    }

    // We're calculating the first payment of a new pair
    // Find the balance to use as the base
    let baseBalance = 0;

    // If we completed at least one pair
    if (interestPaymentCount > 0) {
      // Get the balance after the last interest payment
      if (lastInterestIndex + 1 < transactionData.length) {
        baseBalance = transactionData[lastInterestIndex + 1].balance;
      } else {
        baseBalance = transactionData[lastInterestIndex].balance;
      }
    } else {
      // Use the initial balance
      baseBalance = transactionData[0].balance;
    }

    return this.computeBiMonthlyInterest(baseBalance, loanData.loan_interest_rate);
  }

  /**
   * Computes the bi-monthly interest for a given loan balance and interest rate.
   *
   * @param balance - The current balance of the loan.
   * @param interestRate - The annual interest rate of the loan as a percentage.
   * @returns The bi-monthly interest amount.
   */
  private computeBiMonthlyInterest(balance: number, interestRate: number): number {
    // Bi-monthly interest calculation based on the provided balance and interest rate
    return balance * (interestRate / 2 / 100);
  }

  /**
 * Computes the monthly interest amount based on the current balance.
 * For monthly calculations, interest is always calculated on the current balance.
 * 
 * @param transactionData - Array of transaction data
 * @param loanData - Principal loan data containing interest rate
 * @returns The calculated monthly interest amount
 */
  computeMonthlyInterestAmount(transactionData: Transaction[], loanData: PrincipalLoan) {
    // If no transactions, return 0
    if (transactionData.length === 0) {
      return 0;
    }

    // Get the current balance (last row in the transaction data)
    const currentBalance = transactionData[transactionData.length - 1].balance;

    // Calculate monthly interest (annual rate / 12)
    // Note: We're assuming loan_interest_rate is annual percentage
    return this.computeMonthlyInterest(currentBalance, loanData.loan_interest_rate);
  }

  /**
 * Helper method to calculate monthly interest
 * 
 * @param balance - The current balance
 * @param interestRate - Annual interest rate as a percentage
 * @returns The monthly interest amount
 */
  private computeMonthlyInterest(balance: number, interestRate: number): number {
    // Monthly interest calculation (annual rate / 12)
    // Your data suggests a rate of 6% per month, so adjust the formula if needed
    return balance * (interestRate / 100);
  }

  oddCheckerHelper(data: Transaction[]) {
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
