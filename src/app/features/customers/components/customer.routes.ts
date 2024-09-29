import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "create",
        async loadComponent() {
            const m = await import(
                "./customer-create/customer-create.component"
            );
            return m.CustomerCreateComponent;
        },
    },
    {
        path: "list",
        async loadComponent() {
            const m = await import(
                "./customer-list/customer-list.component"
            );
            return m.CustomerListComponent;
        },
    },
    {
        path: "",
        redirectTo: "create",
        pathMatch: "full",
    },
];