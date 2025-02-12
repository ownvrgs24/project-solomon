import { Injectable } from '@angular/core';


export enum MODE_OF_PAYMENT {
  BI_MONTHLY = 'BI_MONTHLY',
  MONTHLY = 'MONTHLY',
}


@Injectable({
  providedIn: 'root'
})
export class LoanComputationDateDifferenceService {
  /**
   * Determines the interval between two dates in terms of months and days.
   *
   * @param startDate - The start date of the interval.
   * @param endDate - The end date of the interval. Defaults to the current date if not provided.
   * @returns An object containing the number of months and days between the start and end dates.
   *
   * @remarks
   * If the start date is after the end date, the dates are swapped to ensure a positive interval.
   * The calculation assumes a monthly interval by default.
   */
  determineDateInterval(startDate: Date, endDate: Date = new Date()): { months: number; days: number, paid_in_advance?: boolean } {
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (start > end) {
      [start, end] = [end, start];
      return {
        months: 0,
        days: 0,
        paid_in_advance: true,
      }
    }

    // Default calculation for MONTHLY
    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let daysDiff = end.getDate() - start.getDate();

    if (daysDiff < 0) {
      monthsDiff -= 1;
      const previousMonth = new Date(end.getFullYear(), end.getMonth() - 1, start.getDate());
      daysDiff = Math.floor((end.getTime() - previousMonth.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      months: monthsDiff,
      days: daysDiff,
      paid_in_advance: false,
    };
  }
  getNextDueDate(transactionDate: Date, modeOfPayment: MODE_OF_PAYMENT): Date {
    const date = new Date(transactionDate);
    switch (modeOfPayment) {
      case MODE_OF_PAYMENT.BI_MONTHLY:
        date.setDate(date.getDate() + 15);
        break;
      case MODE_OF_PAYMENT.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date;
  }
}

