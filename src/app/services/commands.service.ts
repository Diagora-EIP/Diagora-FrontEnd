import { Injectable } from '@angular/core';
import { environment } from 'environment';
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

    createOrder(description: string, order_date: string, delivery_address: string, company_id: number = 0, order_status: number = 0, schedule_id: number = 0): Observable<any> {
        const requestBody = { description, order_date, delivery_address, company_id, order_status, schedule_id };
        return this.http.post<any>(`${this.apiUrl}/orders/create`, requestBody, this.header);
    }

    updateOrder(id: number, description: string, order_date: string, delivery_address: string, company_id: number = 0, order_status: number = 0, schedule_id: number = 0): Observable<any> {
        const requestBody = { description, order_date, delivery_address, company_id, order_status, schedule_id };
        return this.http.patch<any>(`${this.apiUrl}/orders/${id}`, requestBody, this.header);
    }

    deleteOrder(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/orders/${id}`, this.header);
    }

    getCompanyInfo(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company`, this.header);
    }

}
