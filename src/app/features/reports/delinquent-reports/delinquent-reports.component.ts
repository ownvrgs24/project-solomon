import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { AccountDelinquencyData, PrintingExportService } from './services/printing-export.service';
import { DelinquentReportService } from './services/delinquent-report.service';

@Component({
  selector: 'app-delinquent-reports',
  standalone: true,
  imports: [
    FieldsetModule,
    ButtonModule,

  ],
  templateUrl: './delinquent-reports.component.html',
  styleUrl: './delinquent-reports.component.scss'
})
export class DelinquentReportsComponent {

  private readonly userService = inject(PrintingExportService);
  private readonly service = inject(DelinquentReportService);

  getDelinquentReport() {
    this.service.getDelinquentReport().subscribe({
      next: (response: any) => {
        this.userService.generateDelinquentReport(response.data as AccountDelinquencyData[]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
