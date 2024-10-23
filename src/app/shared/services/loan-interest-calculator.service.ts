import { inject, Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';
import {
  Loan,
  Transaction,
} from '../../features/customers/components/customer-loans/amortization-table/amortization-table.component';

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
  private messageService = inject(MessageService);

  calculateInterest(
    loanData: Loan,
    transactionData: Transaction[]
  ): {
    interest: number;
    balanceInterest: number;
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

    const { interest, balanceInterest, message } = this.computeActualInterest(
      latestBalance,
      loanData.loan_interest_rate,
      months,
      loanData.loan_mode_of_payment,
      days,
      transactionData[selectedIndex]?.balance_interest || 0
    );

    const totalInterest = interest + capitalInterest;

    return {
      interest: totalInterest,
      balanceInterest,
      selectedIndex,
      interestRate: loanData.loan_interest_rate,
      message,
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
    days: number,
    balanceInterest: number
  ): {
    interest: number;
    balanceInterest: number;
    message: string;
  } {
    let interest = 0;
    let message = '';

    if (months >= 0) {
      interest = latestBalance * (interestRate / 100) * months;
    }

    if (modeOfPayment === this.enum.BI_MONTHLY) {
      if (months > 0 || (months === 0 && days >= 15)) {
        interest +=
          latestBalance * (interestRate * this.loanInterestMultiplier);
      }
      message = `Calculated interest for ${months} month(s) and ${days} day(s)`;
    } else if (modeOfPayment === this.enum.MONTHLY) {
      message = `Calculated interest for ${months} month(s)`;
    }

    return {
      interest,
      balanceInterest,
      message,
    };
  }

  accurateDateDifference(
    startDate: Date,
    endDate: Date,
    modeOfPayment?: MODE_OF_PAYMENT
  ) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    const currentDate = new Date();

    // Validate if start date is in the future
    if (start > currentDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Start date cannot be in the future! Please wait for the start date to arrive.',
      });
      throw new Error(
        'Start date cannot be in the future! Please wait for the start date to arrive.'
      );
    }

    // Swap if start date is greater than end date
    if (start > end) {
      [start, end] = [end, start];
    }

    // Direct calculation for BI_MONTHLY
    if (modeOfPayment === MODE_OF_PAYMENT.BI_MONTHLY) {
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      return { months: 0, days: daysDiff };
    }

    // Default calculation for MONTHLY
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    let daysDiff = end.getDate() - start.getDate();

    if (daysDiff < 0) {
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysDiff += lastMonth.getDate();
    }

    return {
      months: monthsDiff,
      days: daysDiff,
    };
  }

  /**
   * Computes the next projected interest based on the mode of payment.
   */
  computeNextProjectedInterest(
    loanData: Loan,
    transactionData: Transaction[]
  ): {
    interest: number;
    selectedIndex: number;
    interestRate: number;
    message: string;
    balanceInterest: number;
    nextPaymentDate: Date;
  } {
    const selectedIndex = this.findLatestApprovedIndex(transactionData);

    const latestBalance =
      selectedIndex !== -1 ? transactionData[selectedIndex].balance : 0;

    // Determine the next date based on the mode of payment
    const lastTransactionDate = new Date(
      transactionData[selectedIndex]?.transaction_date
    );
    const modeOfPayment =
      this.enum[loanData.loan_mode_of_payment as keyof typeof MODE_OF_PAYMENT];

    const nextPaymentDate = this.calculateNextPaymentDate(
      modeOfPayment,
      lastTransactionDate
    );

    const { months, days } = this.accurateDateDifference(
      new Date(transactionData[selectedIndex]?.transaction_date),
      nextPaymentDate,
      modeOfPayment
    );

    const projectedInterest = this.computeActualInterest(
      latestBalance,
      loanData.loan_interest_rate,
      months,
      loanData.loan_mode_of_payment,
      days,
      transactionData[selectedIndex]?.balance_interest || 0
    );

    const capitalInterest = this.calculateCapitalInterest(
      loanData,
      transactionData
    );

    const totalInterest = projectedInterest.interest + capitalInterest;

    return {
      interest: totalInterest,
      balanceInterest: projectedInterest.balanceInterest,
      selectedIndex,
      interestRate: loanData.loan_interest_rate,
      nextPaymentDate,
      message: projectedInterest.message,
    };
  }

  /**
   * Helper to calculate the next payment date based on mode of payment.
   */
  private calculateNextPaymentDate(
    modeOfPayment: MODE_OF_PAYMENT,
    lastTransactionDate: Date
  ): Date {
    const nextDate = new Date(lastTransactionDate);
    if (modeOfPayment === MODE_OF_PAYMENT.BI_MONTHLY) {
      // Add exactly 15 days for BI_MONTHLY payments
      nextDate.setDate(nextDate.getDate() + 15);
    } else if (modeOfPayment === MODE_OF_PAYMENT.MONTHLY) {
      // Add 1 month for MONTHLY payments
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate;
  }
}
