import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {
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

    getItinerary(itineraryId: string): Observable<any> {
        console.log(itineraryId);
        console.log(this.apiUrl);

        return this.http.get<any>(
            `${this.apiUrl}/itinerary/get/${itineraryId}`,
            this.header
        );
    }

}