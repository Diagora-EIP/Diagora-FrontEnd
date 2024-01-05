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
    return this.http.get<any>(`${this.apiUrl}/user`, this.header);
  }

  getUserEntreprise(entreprise: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/entreprise/${entreprise}`, this.header);
  }

  newUserByManager(body: any): Observable<any> {
    const requestBody = body;
    return this.http.post<any>(`${this.apiUrl}/user/newUserByManager`, requestBody, this.header);
  }
}
