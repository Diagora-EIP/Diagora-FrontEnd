import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
    const router = new Router();
    if (localStorage.getItem('token')) {
        return true;
    } else {
        // router.navigate(['/login']);
        return true;
    }
};

export const AuthLeftGuard: CanActivateFn = (route, state) => {
    const router = new Router();
    if (localStorage.getItem('token')) {
        router.navigate(['/home']);
        return false;
    } else {
        return true;
    }
};
