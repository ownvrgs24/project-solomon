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
        path: "update/:id",
        async loadComponent() {
            const m = await import("./account-update/account-update.component");
            return m.AccountUpdateComponent;
        },
    },
    {
        path: "change-password/:id",
        async loadComponent() {
            const m = await import("./account-update/form/change-password/change-password.component");
            return m.ChangePasswordComponent;
        },
    },
    {
        path: "",
        redirectTo: "list",
        pathMatch: "full",
    }
];