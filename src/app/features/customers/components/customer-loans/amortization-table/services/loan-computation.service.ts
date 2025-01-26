import { inject, Injectable } from '@angular/core';
import { PrincipalLoan, Transaction } from '../amortization-table.component';
import { LoanComputationDateDifferenceService, MODE_OF_PAYMENT } from './loan-computation-date-difference.service';
import { MessageService } from 'primeng/api';

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
  calculateInterestAccumulation(transactionData: Transaction[], loanData: PrincipalLoan): LoanRepaymentAnalysis {
    const selectedIndex = this.findMostRecentApprovedIndex(transactionData);
    const { transaction_date } = transactionData[selectedIndex];
    const { loan_mode_of_payment, loan_interest_rate } = loanData;

    const latestBalance = selectedIndex !== -1 ? transactionData[selectedIndex].balance : 0;

    let interest = 0;
    let upperBracketIndex = 0;

    const { days, months, paid_in_advance } = this.computeDateDifference.determineDateInterval(transaction_date, new Date());
    const isDelinquent = this.checkDelinquencyStatus(days, months, loan_mode_of_payment as MODE_OF_PAYMENT);

    if (isDelinquent) {
      // If the loan is delinquent, calculate the delinquent interest based on the balance, interest rate, mode of payment, days, and months.
      interest = this.calculateDelinquentInterest(latestBalance, loan_interest_rate, loan_mode_of_payment as MODE_OF_PAYMENT, days, months);
    }

    upperBracketIndex = this.findUpperPaymentBracketIndex(transactionData);

    if (!isDelinquent) {
      if (loan_mode_of_payment === MODE_OF_PAYMENT.BI_MONTHLY) {
        if (this.isPaymentBracketIncomplete(transactionData)) {
          interest = this.computePartialBracketInterest(transactionData, loan_interest_rate, upperBracketIndex);
        } else {
          // Compute the interest based on the balance, interest rate, and mode of payment
          interest = this.calculateInterest(latestBalance, loan_interest_rate, loan_mode_of_payment as MODE_OF_PAYMENT);

          console.log('Interest: ', interest);

        }
      } else {
        interest = this.calculateInterest(latestBalance, loan_interest_rate, loan_mode_of_payment as MODE_OF_PAYMENT);

        console.log('Interest: ', interest);

      }
    }
    // If the payment bracket is incomplete, compute the partial bracket interest. Applicable only for bi-monthly payments.


    // console.log(this.computeDateDifference.getNextDueDate(
    //   transactionData[upperBracketIndex].transaction_date,
    //   loan_mode_of_payment as MODE_OF_PAYMENT)
    // );



    // console.log(this.computeDateDifference.getNextDueDate(transaction_date, loan_mode_of_payment as MODE_OF_PAYMENT));

    return {
      interest: parseFloat(interest.toFixed(2)),
      selectedIndex,
      loan_interest_rate,
      days,
      months,
      isDelinquent,
      loan_mode_of_payment: loan_mode_of_payment as MODE_OF_PAYMENT,
      find_upper_payment_bracket_index: upperBracketIndex,
      paid_in_advance,
    }
  }

  /**
   * Calculates the interest based on the balance, interest rate, and mode of payment.
   *
   * @param {number} balance - The current balance of the loan.
   * @param {number} interestRate - The annual interest rate of the loan.
   * @param {MODE_OF_PAYMENT} modeOfPayment - The mode of payment, which determines the frequency of interest computation.
   * @returns {number} The computed interest based on the mode of payment.
   */
  private calculateInterest(balance: number, interestRate: number, modeOfPayment: MODE_OF_PAYMENT): number {
    switch (modeOfPayment) {
      case MODE_OF_PAYMENT.BI_MONTHLY:
        return this.computeBiMonthlyInterest(balance, interestRate);
      case MODE_OF_PAYMENT.MONTHLY:
        return this.computeMonthlyInterest(balance, interestRate);
      default:
        return 0;
    }
  }

  /**
   * Calculates the delinquent interest based on the balance, interest rate, mode of payment, 
   * number of days, and number of months.
   * 
   * @param balance - The outstanding balance on which interest is to be calculated.
   * @param interestRate - The annual interest rate as a decimal (e.g., 0.05 for 5%).
   * @param modeOfPayment - The mode of payment, which determines the interest calculation method.
   * @param days - The number of days for which the interest is to be calculated.
   * @param months - The number of months for which the interest is to be calculated.
   * @returns The calculated delinquent interest.
   */
  private calculateDelinquentInterest(balance: number, interestRate: number, modeOfPayment: MODE_OF_PAYMENT, days: number, months: number): number {
    switch (modeOfPayment) {
      case MODE_OF_PAYMENT.BI_MONTHLY:
        const fifteenDaySegments = this.computeFifteenDaySegments(days, months);
        return fifteenDaySegments * this.computeBiMonthlyInterest(balance, interestRate);
      case MODE_OF_PAYMENT.MONTHLY:
        return this.computeMonthlyInterest(balance, interestRate) * months;
      default:
        return 0;
    }
  }

  /**
   * Computes the partial bracket interest for a given set of transactions and loan interest rate.
   *
   * This function calculates the sum of all accumulated capital from approved transactions,
   * computes the bi-monthly interest on that sum, and then adds the interest from the most
   * recent approved payment transaction.
   *
   * @param {Transaction[]} transactionData - An array of transaction objects.
   * @param {number} loanInterestRate - The interest rate of the loan.
   * @returns {number} - The computed partial bracket interest.
   */
  computePartialBracketInterest(transactionData: Transaction[], loanInterestRate: number, upperBracketIndex: number = 0): number {
    const capitalInterest = this.computeBiMonthlyInterest(this.computeAccumulatedCapital(transactionData), loanInterestRate);

    const upperBracketValue = transactionData[upperBracketIndex].balance + transactionData[upperBracketIndex].payment;
    const currentTransactionInterest = this.computeBiMonthlyInterest(upperBracketValue, loanInterestRate);

    return currentTransactionInterest + capitalInterest;
  }

  /**
   * Checks if the payment bracket is incomplete based on the transaction data.
   * A payment bracket is considered incomplete if the number of transactions with a payment greater than 0 is odd.
   *
   * @param {Transaction[]} transactionData - The array of transaction objects to be evaluated.
   * @returns {boolean} - Returns `true` if the payment bracket is incomplete (odd number of payments), otherwise `false`.
   */
  isPaymentBracketIncomplete(transactionData: Transaction[]): boolean {
    const paymentCount = transactionData.filter(transaction => transaction.payment > 0).length;
    return paymentCount % 2 !== 0;
  }

  computeFifteenDaySegments(days: number, months: number): number {
    return Math.floor((months * 30 + days) / 15);
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
  checkDelinquencyStatus(days: number, month: number, modeOfPayment: MODE_OF_PAYMENT): boolean {
    if (modeOfPayment === MODE_OF_PAYMENT.BI_MONTHLY) {
      return days > 15;
    }

    if (modeOfPayment === MODE_OF_PAYMENT.MONTHLY) {
      return month > 1;
    }

    return false;
  }

  /**
   * Finds the index of the most recent transaction with an 'APPROVED' status.
   *
   * @param transactionData - An array of transactions to search through.
   * @returns The index of the most recent transaction with an 'APPROVED' status, or -1 if no such transaction is found.
   */
  private findMostRecentApprovedIndex(transactionData: Transaction[]): number {
    return transactionData.findLastIndex(({ transaction_status }) => transaction_status === TRANSACTION_STATUS.APPROVED);
  }

  /**
   * Finds the index of the upper payment bracket in the transaction data.
   * Iterates through the transaction data array in reverse order to find the
   * first transaction that is both approved and a payment.
   *
   * @param {Transaction[]} transactionData - The array of transaction data to search through.
   * @returns {number} The index of the upper payment bracket if found, otherwise -1.
   */
  private findUpperPaymentBracketIndex(transactionData: Transaction[]): number {
    for (let i = transactionData.length - 1; i >= 0; i--) {
      const { transaction_status, is_payment } = transactionData[i];
      if (transaction_status === TRANSACTION_STATUS.APPROVED && is_payment) {
        return i;
      }
    }
    return 0;
  }

  computeAccumulatedCapital(transactionData: Transaction[]): number {
    let totalAccumulatedCapital = 0;

    for (let index = transactionData.length - 1; index >= 0; index--) {
      const { transaction_status, capital, is_payment } = transactionData[index];
      if (transaction_status === TRANSACTION_STATUS.APPROVED && capital > 0) {
        totalAccumulatedCapital += capital;
      }

      if (capital === 0 && is_payment) {
        break;
      }
    }

    return totalAccumulatedCapital;
  }
}
