import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private router: Router, private persmissionsService: PermissionsService) { }

        canActivate(route: ActivatedRouteSnapshot): boolean {
            if (localStorage.getItem('token')) {
                console.log('Checking permissions for => ' + route.data['permission'] + ' : ' + this.persmissionsService.hasPermission(route.data['permission']));
                
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
        }
        return true;
    }
}
