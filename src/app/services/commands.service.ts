import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommandsService {
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

    getOrders(date: string): Observable<any> {
        const begin = `${date}T00:00:00.000Z`;
        const end = `${date}T23:59:59.999Z`;
        return this.http.get<any>(`${this.apiUrl}/orders/between-dates?begin=${begin}&end=${end}`, this.header);
    }

    getSchedules(date: string, userId: number): Observable<any> {
        const begin = `${date}T00:00:00.000Z`;
        const end = `${date}T23:59:59.999Z`;
        return this.http.get<any>(`${this.apiUrl}/schedule/get-between-date/${userId}?start_date=${begin}&end_date=${end}`, this.header);
    }

    createOrder(description: string, delivery_date: string, delivery_address: string): Observable<any> {
        const requestBody = { description, delivery_date, delivery_address, estimated_time: 3600, actual_time:1800, order_date: delivery_date };
        return this.http.post<any>(`${this.apiUrl}/schedule/create`, requestBody, this.header);
    }

    updateOrder(id: number, delivery_date: string): Observable<any> {
        const requestBody = { delivery_date };
        return this.http.patch<any>(`${this.apiUrl}/schedule/update/${id}`, requestBody, this.header);
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/schedule/delete/${id}`, this.header);
    }

    getCompanyInfo(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company`, this.header);
    }

}
