import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "create",
        async loadComponent() {
            const m = await import(
                "./account-create/account-create.component"
            );
            return m.AccountCreateComponent;
        },
    },
    {
        path: "list",
        async loadComponent() {
            const m = await import(
                "./account-list/account-list.component"
            );
            return m.AccountListComponent;
        },
    },
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    }
];