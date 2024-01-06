import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    private userPermissionsSubject = new BehaviorSubject<string[]>([]);
    userPermissions = this.userPermissionsSubject.asObservable();
    token = localStorage.getItem('token');

    header: any = {};

    apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {
        if (this.token != null) {
            this.header = {
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            }
        }
        this.getPermissions().subscribe({
            next: (data) => {
                console.log("DATA ", data);
                let permissions = [];
                for (let i = 0; i < data.length; i++) {
                    permissions.push(data[i].name);
                }
                this.setUserPermissions(permissions);
            }
        });
    }

    deleteUserPermissions(): void {
        this.userPermissionsSubject = new BehaviorSubject<string[]>([]);
        this.userPermissions = this.userPermissionsSubject.asObservable();
    }

    forceRefreshPermissions(): void {
        console.log('Forcing refresh of permissions');
        this.refreshPermissions();
    }

    private refreshPermissions(): void {
        if (this.token !== null) {
            this.getPermissions().subscribe({
                next: (data) => {
                    console.log("DATA ", data);
                    let permissions = [];
                    for (let i = 0; i < data.length; i++) {
                        permissions.push(data[i].name);
                    }
                    this.setUserPermissions(permissions);
                },
                error: (error) => {
                    console.error('Error refreshing permissions:', error);
                }
            });
        }
    }

    getPermissions(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/userRoles`, this.header);
    }

    setUserPermissions(permissions: string[]): void {
        this.userPermissionsSubject.next(permissions);
    }

    hasPermission(permission: string): boolean {
        const permissions = this.userPermissionsSubject.getValue();
        return permissions.includes(permission);
    }
}
