import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

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

    getTeamsList(): Observable<any> {
        return this.http.get(`${this.apiUrl}/teams/findAll`, this.header);
    }

    getTeamUsers(team_id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/user-teams/find-team-all-users/${team_id}`, this.header);
    }

    updateTeam(team_id: string, body: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/team/${team_id}`, body, this.header);
    }

    createTeam(body: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/team`, body, this.header);
    }

    deleteTeam(team_id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/team/${team_id}`, this.header);
    }

    createUserTeamLink(team_id: string, user_id: string): Observable<any> {
      const body = {
        team_id: team_id,
        user_id: user_id
      }
      return this.http.post(`${this.apiUrl}/user-teams/${team_id}/user/${user_id}`, body, this.header);
    }

    deleteUserTeamLink(team_id: string, user_id: string): Observable<any> {
      const body = {
        team_id: team_id,
        user_id: user_id
      }
      return this.http.delete(`${this.apiUrl}/user-teams/${team_id}/user/${user_id}`, this.header);
    }
}
