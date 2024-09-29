import { Routes } from '@angular/router';

export const coreRoutes: Routes = [
    {
        path: "dashboard",
        async loadComponent() {
            const m = await import("../features/dashboard/dashboard.component");
            return m.DashboardComponent;
        },
        loadChildren: async () => {
            const m = await import("../features/dashboard/dashboard.routes");
            return m.routes;
        }
    },
    {
        path: "approvals",
        async loadComponent() {
            const m = await import("../features/approvals/approvals.component");
            return m.ApprovalsComponent;
        },
        loadChildren: async () => {
            const m = await import("../features/approvals/approvals.routes");
            return m.routes;
        }
    },
    {
        path: "accounts",
        async loadComponent() {
            const m = await import("../features/accounts/accounts.component");
            return m.AccountsComponent;
        },
        loadChildren: async () => {
            const m = await import("../features/accounts/accounts.routes");
            return m.routes;
        }
    },
    {
        path: "customers",
        async loadComponent() {
            const m = await import("../features/customers/components/customer.component");
            return m.CustomerComponent;
        },
        async loadChildren() {
            const m = await import("../features/customers/components/customer.routes");
            return m.routes;
        }
    },
    {
        path: "reports",
        async loadComponent() {
            const m = await import("../features/reports/reports.component");
            return m.ReportsComponent;
        },
        loadChildren: async () => {
            const m = await import("../features/reports/reports.routes");
            return m.routes;
        }
    },
    {
        path: "system-logs",
        async loadComponent() {
            const m = await import("../features/system-logs/system-logs.component");
            return m.SystemLogsComponent;
        },
        loadChildren: async () => {
            const m = await import("../features/system-logs/system-logs.routes");
            return m.routes;
        }
    },
    {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
    }
];
