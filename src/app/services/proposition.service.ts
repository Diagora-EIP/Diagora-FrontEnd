import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PropositionService {
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

    SendProposition(date: string, schedule_ids: [], accept: boolean, user_id: number): Observable<any> {
        const body = { date, schedule_ids, accept, user_id};
        console.log(body);
        return this.http.post<any>(`${this.apiUrl}/proposition/`, body, { headers: this.getHeaders() });
      }

}