import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StatisticService {
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

    getExpense(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/statistic/expense`, this.header);
    }

    getClientCount(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/statistic/client/count`, this.header);
    }

    getOrder(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/statistic/order`, this.header);
    }
}
