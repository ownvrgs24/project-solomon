import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { MonthlyReportService } from './services/monthly-report.service';
import { PrintingExportService } from './services/printing-export.service';
import { UpperCaseInputDirective } from '../../../shared/directives/to-uppercase.directive';


interface MonthlyReportsForm {
  selected_month: FormControl<Date | null>;
}

@Component({
  selector: 'app-monthly-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    FieldsetModule,
  ],
  templateUrl: './monthly-reports.component.html',
  styleUrl: './monthly-reports.component.scss'
})
export class MonthlyReportsComponent {
  private readonly monthlyReportService = inject(MonthlyReportService);
  private readonly printing = inject(PrintingExportService);
  public readonly maxDate = new Date();

  monthlyReportsForm: FormGroup<MonthlyReportsForm> = new FormGroup<MonthlyReportsForm>({
    selected_month: new FormControl<Date | null>(new Date(), [Validators.required]),
  });

  submitMonthlyReport() {
    this.monthlyReportService.getMonthlyReport(this.monthlyReportsForm.value).subscribe({
      next: (res: any) => {
        const { selected_month } = this.monthlyReportsForm.value;
        const {
          monthly_cash_on_hand,
          monthly_expenses,
          monthly_cash_release,
          monthly_cash_collection,
          monthly_cash_changes
        } = res.data;

        this.printing.createMonthlyReport(
          monthly_cash_on_hand,
          monthly_expenses,
          monthly_cash_release,
          monthly_cash_collection,
          monthly_cash_changes,
          selected_month || new Date(),
        );
      },
      error: () => {
        console.log('error');
      }
    });
  }
}

