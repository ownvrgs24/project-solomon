import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        async loadComponent() {
            const c = await import('./features/auth/components/login.component');
            return c.LoginComponent;
        },
    },
    {
        path: "core",
        async loadComponent() {
            const c = await import('./core/core.component');
            return c.CoreComponent;
        },
        loadChildren: async () => {
            const m = await import('./core/core.routes');
            return m.coreRoutes;
        }
    },
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    // {
    //     path: "**",
    //     redirectTo: "login",
    //     pathMatch: "full"
    // }
];
