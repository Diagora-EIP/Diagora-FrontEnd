import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AbsenceService {
    token = localStorage.getItem('token');
    user_id = localStorage.getItem('id');

    header: any = {};

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        if (this.token != null) {
            this.header = {
                headers: {
                    "Content-Type": "application/json",
                    authorization: 'Bearer ' + this.token
                }
            }
        }
    }

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        if (this.token) {
            headers = headers.set('Authorization', `Bearer ${this.token}`);
        }
        return headers;
    }

    createAbsence(userId: number, date: string): Observable<any> {
        const body = { date };
        return this.http.post<any>(`${this.apiUrl}/manager/absence/${userId}`, body, { headers: this.getHeaders() });
      }

}