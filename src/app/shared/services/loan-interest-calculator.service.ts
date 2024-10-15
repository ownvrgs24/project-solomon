import { Injectable } from '@angular/core';
import {
  Loan,
  Transaction,
} from '../../features/customers/components/customer-loans/ammortization-table/ammortization-table.component';

export enum MODE_OF_PAYMENT {
  BI_MONTHLY = 'BI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

@Injectable({
  providedIn: 'root',
})
export class LoanInterestCalculatorService {
  protected readonly loanInterestMultiplier: number = 0.005;
  private enum: typeof MODE_OF_PAYMENT = MODE_OF_PAYMENT;
  private loanInterestMessage: string = '';

  calculateInterest(
    loanData: Loan,
    transactionData: Transaction[]
  ): {
    interest: number;
    selectedIndex: number;
    interestRate: number;
    message: string;
  } {
    const selectedIndex = this.findLatestApprovedIndex(transactionData);
    const latestBalance =
      selectedIndex !== -1 ? transactionData[selectedIndex].balance : 0;

    const capitalInterest = this.calculateCapitalInterest(
      loanData,
      transactionData
    );

    // Get the projected interest
    const { days, months } = this.accurateDateDifference(
      new Date(transactionData[selectedIndex]?.transaction_date),
      new Date()
    );

    const interest = this.computeActualInterest(
      latestBalance,
      loanData.loan_interest_rate,
      months,
      loanData.loan_mode_of_payment,
      days
    );

    return {
      interest: capitalInterest + interest,
      selectedIndex,
      interestRate: loanData.loan_interest_rate,
      message: this.loanInterestMessage,
    };
  }

  calculateCapitalInterest(
    loanData: Loan,
    transactionData: Transaction[]
  ): number {
    if (!this.oddCheckerHelper(transactionData)) return 0;

    const interestWithinCapital = transactionData.reduce(
      (sum, { transaction_status, capital }) => {
        return transaction_status === 'APPROVED' &&
          capital !== undefined &&
          capital > 0
          ? sum + capital
          : sum;
      },
      0
    );

    return (
      interestWithinCapital *
      (loanData.loan_interest_rate * this.loanInterestMultiplier)
    );
  }

  // Helper to find the latest approved index
  private findLatestApprovedIndex(transactionData: Transaction[]): number {
    return transactionData.findLastIndex(
      ({ transaction_status }) => transaction_status === 'APPROVED'
    );
  }

  oddCheckerHelper(data: Transaction[]): boolean {
    return (
      data.filter((t) => t.payment !== undefined && t.payment > 0).length %
        2 !==
      0
    );
  }

  // Helper to calculate projected interest
  private computeActualInterest(
    latestBalance: number,
    interestRate: number,
    months: number,
    modeOfPayment: string,
    days: number
  ): number {
    let interest = 0;

    if (months >= 0) {
      interest = latestBalance * (interestRate / 100) * months;
    }

    if (modeOfPayment === this.enum.BI_MONTHLY) {
      if (months > 0 || (months === 0 && days >= 15)) {
        interest +=
          latestBalance * (interestRate * this.loanInterestMultiplier);
      }
      this.loanInterestMessage = `Calculated interest for ${months} month(s) and ${days} day(s)`;
    } else if (modeOfPayment === this.enum.MONTHLY) {
      this.loanInterestMessage = `Calculated interest for ${months} month(s)`;
    }

    return interest;
  }

  accurateDateDifference(startDate: Date, endDate: Date) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Swap if start date is greater than end date
    if (start > end) {
      [start, end] = [end, start];
    }

    // Calculate months difference
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Calculate days difference
    let daysDiff = end.getDate() - start.getDate();

    // Adjust days difference if it's negative
    if (daysDiff < 0) {
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysDiff += lastMonth.getDate();
    }

    return {
      months: monthsDiff,
      days: daysDiff,
    };
  }
}
