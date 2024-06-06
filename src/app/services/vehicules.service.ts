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

    updateUserVehicle(user_id: any, vehicle_id: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/vehicles/${user_id}/vehicles/${vehicle_id}`, null, this.header);
    }

    getUserVehicle(user_id: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user/${user_id}/vehicles`, this.header);
    }

    createExpense(vehicle_id: number, name: string, description: string, price: number, picture: any, user_id?: number): Observable<any> {
        const requestBody = {
            title: name,
            description: description,
            amount: price,
            vehicle_id: vehicle_id,
            picture: picture
        };
        const url = `${this.apiUrl}/vehicleExpense` + (user_id ? `/${user_id}` : '');
        return this.http.post<any>(url, requestBody, this.header);
    }

    lockVehicle(vehicle_id: number, date: any, user_id?: number): Observable<any> {
        const url = `${this.apiUrl}/vehicleLock` + (user_id ? `/${user_id}` : '');
        const body = {
            vehicle_id: vehicle_id,
            lock_date: date
        };
        return this.http.post<any>(url, body, this.header);
    }

    unlockVehicle(vehicle_lock_id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/vehicleLock/${vehicle_lock_id}`, this.header);
    }

    getVehicleLock(date: any, user_id?: number): Observable<any> {
        const url = `${this.apiUrl}/vehicleLock` + (user_id ? `/${user_id}` : '');
        return this.http.get<any>(`${url}?date=${date}`, this.header);
    }

    getUserVehicleExpenses(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/vehicleExpense`, this.header);
    }

    updateVehicleExpense(id: number, name: string, description: string, price: number, picture: any): Observable<any> {
        const requestBody = {
            title: name,
            description: description,
            amount: price,
            picture: picture
        };
        return this.http.patch<any>(`${this.apiUrl}/vehicleExpense/${id}`, requestBody, this.header);
    }

    deleteVehicleExpense(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/vehicleExpense/${id}`, this.header);
    }
}
