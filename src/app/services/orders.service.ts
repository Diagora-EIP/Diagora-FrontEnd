import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    token = localStorage.getItem('token');
    user_id = localStorage.getItem('id');

    header: any = {};

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        if (this.token != null) {
            this.header = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + this.token,
                },
            };
        }
    }

    getOrdersBetweenDates(
        startDate: string,
        endDate: string,
        withSchedule: boolean = false
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/order/?start_date=${startDate}&end_date=${endDate}&withSchedule=${withSchedule}`,
            this.header
        );
    }
}