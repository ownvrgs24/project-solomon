import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'daily-report',
        async loadComponent() {
            const m = await import('./daily-reports/daily-reports.component');
            return m.DailyReportsComponent;
        }
    },
    {
        path: 'monthly-report',
        async loadComponent() {
            const m = await import('./monthly-reports/monthly-reports.component');
            return m.MonthlyReportsComponent;
        }
    },
    {
        path: 'annual-report',
        async loadComponent() {
            const m = await import('./annual-reports/annual-reports.component');
            return m.AnnualReportsComponent;
        }
    },
    {
        path: "delinquent-report",

    },
    {
        path: "**",
        redirectTo: "daily-report",
        pathMatch: "full",
    },
    {
        path: "",
        redirectTo: "daily-report",
        pathMatch: "full",
    }
];