import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { PrintingExportService } from './services/printing-export.service';
import { AnnualReportService } from './services/annual-report.service';

interface AnnualReportsForm {
  selected_year: FormControl<Date | null>;
}
@Component({
  selector: 'app-annual-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    FieldsetModule,
  ],
  templateUrl: './annual-reports.component.html',
  styleUrl: './annual-reports.component.scss'
})
export class AnnualReportsComponent {
  public readonly maxDate = new Date();
  private readonly annualReportService = inject(AnnualReportService);
  private readonly printing = inject(PrintingExportService);

  annualReportsForm: FormGroup<AnnualReportsForm> = new FormGroup<AnnualReportsForm>({
    selected_year: new FormControl<Date | null>(new Date(), [Validators.required]),
  });

  getAnnualReport() {
    this.annualReportService.getAnnualReport(this.annualReportsForm.value).subscribe({
      next: (res: any) => {
        const { selected_year } = this.annualReportsForm.value;
        const {
          annual_cash_on_hand,
          annual_expenses,
          annual_cash_released,
          annual_cash_collection,
          annual_cash_changes
        } = res.data;

        this.printing.createAnnualReport(
          annual_cash_on_hand,
          annual_expenses,
          annual_cash_released,
          annual_cash_collection,
          annual_cash_changes,
          selected_year || new Date(),
        );
      },
      error: () => {
        console.log('error');
      }
    });
  }
}
