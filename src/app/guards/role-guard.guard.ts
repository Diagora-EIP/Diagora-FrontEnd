import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private router: Router, private persmissionsService: PermissionsService) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        console.log('Checking permissions for => ' + route.data['permission']);
        if (localStorage.getItem('token')) {
            // this.persmissionsService.forceRefreshPermissions();
            if (this.persmissionsService.hasPermission(route.data['permission'])) {
                return true;
            }
        }
        this.router.navigate(['/login']);
        return false;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthLeftGuard {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (localStorage.getItem('token')) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}

// export const userGuard: CanActivateFn = (route, state) => {
//     const router = new Router();
//     const token = localStorage.getItem('token');
//     if (token) {
//         if (getRoleUser(token))
//             return true;
//         else {
//             router.navigate(['/home']);
//             return false
//         }
//     } else {
//         router.navigate(['/login']);
//         return false
//     }
// };

// export const adminGuard: CanActivateFn = (route, state) => {
//     const router = new Router();
//     const token = localStorage.getItem('token');
//     if (token) {
//         if (getRoleAdmin(token))
//             return true
//         else {
//             router.navigate(['/home']);
//             return false
//         }
//     } else {
//         router.navigate(['/login']);
//         return false;
//     }
// };

// export function decodeJWT(token: string): any {
//     const payload = token.split('.')[1];
//     const decodedPayload = atob(payload);
//     return JSON.parse(decodedPayload);
// }

// export function getRoleUser(token: string): boolean | null {
//     try {
//         const decoded = decodeJWT(token);
//         const userRole: boolean = decoded.isUser;
//         return userRole;
//     } catch (error) {
//         return null;
//     }
// }

// export function getRoleAdmin(token: string): boolean | null {
//     try {
//         const decoded = decodeJWT(token);
//         const userRole: boolean = decoded.isAdmin;
//         return userRole;
//     } catch (error) {
//         return null;
//     }
// }

