import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
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

    login(email: string, password: string, remember: boolean): Observable<any> {
        const requestBody = { email, password, remember };
        return this.http.post<any>(`${this.apiUrl}/user/login`, requestBody);
    }

    register(name: string, email: string, password: string): Observable<any> {
        const requestBody = { name, email, password };
        return this.http.post<any>(`${this.apiUrl}/user/register`, requestBody);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/user/send-email/${email}`, {});
    }

    resetPassword(id: string, password: string): Observable<any> {
        const user_id = parseInt(id);
        const requestBody = { user_id: user_id, password: password };
        console.log(requestBody);
        return this.http.post<any>(`${this.apiUrl}/user/reset-password-without-token-email`, requestBody);
    }
}
