import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() { }

    getToken() {
        return localStorage.getItem('token');
    }

    getUserId() {
        return localStorage.getItem('id');
    }

    getEmail() {
        return localStorage.getItem('email');
    }

    getRemember() {
        return localStorage.getItem('remember');
    }

    /**
     * Check if email is valid
     * @param {string} email
     * @returns {boolean} true if email is valid, false otherwise
     */
    checkEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email)
    }
}
