import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
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

    getUserInfos(): Observable<any> {
        console.log(this.apiUrl)
        return this.http.get<any>(`${this.apiUrl}/user`, this.header);
    }

    updateUserInformations(body: any): Observable<any> {
        const requestBody = body;
        return this.http.patch<any>(`${this.apiUrl}/user/`, requestBody, this.header);
    }

    updatePassword(body: any): Observable<any> {
        const requestBody = body;
        return this.http.patch<any>(`${this.apiUrl}/resetPassword`, requestBody, this.header);
    }

    getRolesList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/roles`, this.header);
    }
}
