import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private router: Router, private permissionsService: PermissionsService, private locate: Location) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

        return this.permissionsService.refreshPermissions().pipe(
            switchMap(() => {
                if (localStorage.getItem('token')) {

                    if (route.data['permission'].some((permission: string) => this.permissionsService.hasPermission(permission)))
                        return of(true);
                    else {
                        this.router.navigate(['/login']);
                        return of(false);
                    }

                }
                this.router.navigate(['/login']);
                return of(false);
            }),
            catchError(() => {
                this.router.navigate(['/login']);
                return of(true);
            })
        );
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthLeftGuard {
    constructor(private router: Router, private permissionsService: PermissionsService) { }

    canActivate(): boolean {
        if (localStorage.getItem('token')) {
            this.permissionsService.refreshPermissions().pipe(
                switchMap(() => {
                    this.router.navigate(['/home']);
                    return of(false);
                }),
                catchError(() => {
                    return of(true);
                })
            );
        }
        return true;
    }
}

