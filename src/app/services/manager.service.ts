import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ManagerService {
    token = localStorage.getItem('token');
    user_id = localStorage.getItem('id');

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
    }

    getManagerEntreprise(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company`, this.header);
    }

    getUserEntreprise(entreprise: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user/entreprise/${entreprise}`, this.header);
    }

    newUserByManager(email: string, name: string, roles: string[]): Observable<any> {
        const requestBody = { email, name, roles };
        return this.http.post<any>(`${this.apiUrl}/manager/user`, requestBody, this.header);
    }

    getUserInformations(id: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/userRoles/${id}`, this.header);
    }

    updateUserInformations(id: any, name: string): Observable<any> {
        const requestBody = {
            name: name
        };
        return this.http.patch<any>(`${this.apiUrl}/user/${id}`, requestBody, this.header);
    }

    updateEntreprise(body: any): Observable<any> {

        // const requestBody = body;
        const requestBody = { name: body.name, address: body.number + ' ' + body.rue + ',' + body.postalCode + ',' + body.ville };
        return this.http.patch<any>(`${this.apiUrl}/company`, requestBody, this.header);
    }

    updateRoles(id: any, rolesList: any[]): Observable<any> {
        const requestBody = {
            role: rolesList
        };
        return this.http.patch<any>(`${this.apiUrl}/manager/userRole/${id}`, requestBody, this.header);
    }

    deleteUser(id: any): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/manager/user/${id}`, this.header);
    }
}
