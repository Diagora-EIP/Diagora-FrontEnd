import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class UserService {
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

    getUserInfos(): Observable<any> {
        console.log(this.apiUrl)
        return this.http.get<any>(`${this.apiUrl}/user`,
            this.header
        );
    }

    // async getUserInfos() {
    //     const response = await axios.get(this.apiUrl + '/user/all', this.header);
    //     return response.data;
    // }
}