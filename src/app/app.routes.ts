import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        async loadComponent() {
            const c = await import('./features/auth/components/login.component');
            return c.LoginComponent;
        },
        canActivate: [publicGuard],
    },
    {
        path: "core",
        async loadComponent() {
            const c = await import('./core/core.component');
            return c.CoreComponent;
        },
        canActivate: [authGuard],
        loadChildren: async () => {
            const m = await import('./core/core.routes');
            return m.coreRoutes;
        },
    },
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "**",
        redirectTo: "login",
        pathMatch: "full"
    }
];
