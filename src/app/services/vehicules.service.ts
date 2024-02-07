import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VehiculesService {
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

    getVehicules(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/vehicles`, this.header);
    }

    createVehicule(name: string, brand: string, model: string, license: string, mileage: number): Observable<any> {
        const requestBody = {
            name,
            brand,
            model,
            license,
            mileage: mileage === 0 ? 1 : mileage
        };
        return this.http.post<any>(`${this.apiUrl}/vehicle`, requestBody, this.header);
    }

    updateVehicule(id: number, name: string, brand: string, model: string, license: string, mileage: number): Observable<any> {
        const requestBody = {
            name,
            brand,
            model,
            license,
            mileage: mileage === 0 ? 1 : mileage
        };
        return this.http.patch<any>(`${this.apiUrl}/vehicle/${id}`, requestBody, this.header);
    }

    deleteVehicule(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/vehicle/${id}`, this.header);
    }

    getCompanyInfo(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company`, this.header);
    }

}
