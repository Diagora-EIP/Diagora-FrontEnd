import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
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

    async getUsers() {
        const response = await axios.get(this.apiUrl + '/user/all', this.header);
        return response.data;
    }

    async getRoles(user_id: string) {
        const response = await axios.get(this.apiUrl + '/user/permissions/' + user_id, this.header);
        return response.data;
    }

    async getEntreprises() {
        const response = await axios.get(this.apiUrl + '/company', this.header);
        return response.data;
    }

    async createUser(email: string, name: string, roles: any) {
        const response = await axios.post(this.apiUrl + '/admin/createUser', { email: email, name: name, roles: roles, user_id: this.user_id }, this.header);
        return response.data;
    }

    getCompany(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/company`, this.header);
    }

    createCompany(name: string): Observable<any> {
        const empty: number[] = []
        const requestBody = { name, users_ids: empty };
        return this.http.post<any>(`${this.apiUrl}/company`, requestBody, this.header);
    }

    updateCompany(name: string, company_id: number, users_id: number[]): Observable<any> {
        const requestBody = { name, users_ids: users_id };
        return this.http.patch<any>(`${this.apiUrl}/company/${company_id}`, requestBody, this.header);
    }
}
