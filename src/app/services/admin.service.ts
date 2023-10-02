import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environnement';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    token = localStorage.getItem('token');

    header: any = {};

    apiUrl = environment.apiUrl;
    constructor() {
        if (this.token != null) {
            this.header = {
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            }
        }
    }

    async getUsers() {
        const response = await axios.get(this.apiUrl + '/user', this.header);
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
}
