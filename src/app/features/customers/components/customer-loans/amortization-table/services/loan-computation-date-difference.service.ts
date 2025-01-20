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
   */
  determineDateInterval(startDate: Date, endDate: Date = new Date()): { months: number; days: number } {
    let start = new Date(startDate);
    let end = new Date(endDate);
    // Default calculation for MONTHLY
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let daysDiff = end.getDate() - start.getDate();
    if (daysDiff < 0) {
      const previousMonth = new Date(end.getFullYear(), end.getMonth() - 1, start.getDate());
      daysDiff = Math.floor((end.getTime() - previousMonth.getTime()) / (1000 * 60 * 60 * 24));
    }
    return {
      months: monthsDiff,
      days: daysDiff,
    };
  }

}
