import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private apiUrl = environment.apiUrl;
    private token = localStorage.getItem('token');
    private user_id = localStorage.getItem('id');

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        if (this.token) {
            headers = headers.set('Authorization', `Bearer ${this.token}`);
        }
        return headers;
    }

    createTeam(name: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/team`, { name }, { headers: this.getHeaders() });
    }

    deleteTeam(teamId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/team/${teamId}`, { headers: this.getHeaders() });
    }

    updateTeam(teamId: number, name?: string, color?: string): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/team/${teamId}`, { name, color }, { headers: this.getHeaders() });
    }

    getAllTeams(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/teams/findAll`, { headers: this.getHeaders() });
    }

    getTeam(teamId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/team/${teamId}`, { headers: this.getHeaders() });
    }

    assignUserToTeam(teamId: number, userId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/user-teams/${teamId}/user/${userId}`, {}, { headers: this.getHeaders() });
    }

    getTeamUsers(teamId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user-teams/${teamId}`, { headers: this.getHeaders() });
    }

    getUserTeams(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user-teams/user/${userId}`, { headers: this.getHeaders() });
    }

    deleteUserFromTeam(teamId: number, userId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/user-teams/${teamId}/user/${userId}`, { headers: this.getHeaders() });
    }
}
