import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    userPermissionsSubject = new BehaviorSubject<string[]>([]);
    userPermissions = this.userPermissionsSubject.asObservable();
    token = localStorage.getItem('token');

    header: any = {};

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        if (localStorage.getItem('token') != null) {
            this.header = {
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            }
        }
    }

    deleteUserPermissions(): void {
        this.userPermissionsSubject = new BehaviorSubject<string[]>([]);
        this.userPermissions = this.userPermissionsSubject.asObservable();
    }

    forceRefreshPermissions(): Observable<void | null> {
        return this.refreshPermissions().pipe(take(1));
    }

    public refreshPermissions(): Observable<void | null> {
        if (localStorage.getItem('token') !== null) {
            this.token = localStorage.getItem('token');
            this.header = {
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            }
            return this.getPermissions().pipe(
                switchMap((data: { name: string }[]) => {
                    let permissions: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                        permissions.push(data[i].name);
                    }
                    this.setUserPermissions(permissions);
                    return of(null); // Emit a value to complete the observable
                }),
                catchError((error) => {
                    console.error('Error refreshing permissions:', error);
                    throw new Error('Error refreshing permissions'); 
                     // Emit a value to complete the observable
                })
            );
        } else {
            return of(null); // Emit a value to complete the observable
        }
    }

    getPermissions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/userRoles`, this.header).pipe(
            switchMap(response => {
                if (response instanceof Array) {
                    return of(response);
                } else {
                    return of([]);
                }
            })
        );
    }

    setUserPermissions(permissions: string[]): void {
        this.userPermissionsSubject.next(permissions);
    }

    hasPermission(permission: string): boolean {
        const permissions = this.userPermissionsSubject.getValue();
        return permissions.includes(permission);
    }

    getUserId(): number {
        if (!this.token)
            return 0;
        let token = this.token.split('.')[1];
        let user = JSON.parse(atob(token));
        return user.id;
    }
}
