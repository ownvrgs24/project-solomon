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
        path: "",
        redirectTo: "daily-report",
        pathMatch: "full",
    }
];