import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
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

  getManagerEntreprise(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company`, this.header);
  }

  getUserEntreprise(entreprise: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/entreprise/${entreprise}`, this.header);
  }

  newUserByManager(body: any): Observable<any> {
    const requestBody = body;
    console.log(requestBody);
    return this.http.post<any>(`${this.apiUrl}/manager/user`, requestBody, this.header);
  }

  getUserInformations(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userRoles/${id}`, this.header);
  }

  updateUserInformations(id: any, body: any): Observable<any> {
    const requestBody = body;
    return this.http.patch<any>(`${this.apiUrl}/user/${id}`, requestBody, this.header);
  }

  updateEntreprise(body: any): Observable<any> {
    const requestBody = body;
    return this.http.patch<any>(`${this.apiUrl}/company`, requestBody, this.header);
  }

  updateRoles(id: any, body: any): Observable<any> {
    const requestBody = body;
    return this.http.patch<any>(`${this.apiUrl}/manager/userRole/${id}`, requestBody, this.header);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/manager/user/${id}`, this.header);
  }
}
