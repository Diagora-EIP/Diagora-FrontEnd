import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScheduleService {
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

    updateSchedule(scheduleId: number, updatedData: any): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/schedule/update/${scheduleId}`,
            updatedData,
            this.header
        );
    }

    updateScheduleByUser(user_id: number, scheduleId: number, updatedData: any): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/schedule/update/${user_id}/${scheduleId}`,
            updatedData,
            this.header
        );
    }

    getScheduleBetweenDates(
        startDate: string,
        endDate: string
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/schedule/get-between-date?start_date=${startDate}&end_date=${endDate}`,
            this.header
        );
    }

    getScheduleBetweenDatesByUser(
        startDate: string,
        endDate: string,
        user_id: number
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/schedule/get-between-date/${user_id}?start_date=${startDate}&end_date=${endDate}`,
            this.header
        );
    }

    getScheduleById(
        schedule_id: number,
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/schedule/${schedule_id}`,
            this.header,
        );
    }

    createSchedule(scheduleData: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/schedule/create`,
            scheduleData,
            this.header
        );
    }

    createScheduleByUser(user_id: number, scheduleData: any): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/schedule/create/with-user-id/${user_id}`,
            scheduleData,
            this.header
        );
    }

    deleteSchedule(scheduleId: number): Observable<any> {
        return this.http.delete<any>(
            `${this.apiUrl}/schedule/delete/${scheduleId}`,
            this.header
        );
    }
}
