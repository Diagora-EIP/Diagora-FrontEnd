import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
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
    }

    createClient(client: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/client`, client, this.header);
    }

    getAllClientsByCompany(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/clients/getAll`, this.header);
    }
    
    getOrderByClient(header: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/order/get-order-by-client`, header);
    }
}
