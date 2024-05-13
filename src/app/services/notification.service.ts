import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  token = localStorage.getItem('token');
  user_id = localStorage.getItem('id');
  company_id = localStorage.getItem('company_id');
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

  getNotification(): Observable<any> {
    const requestBody = {
      page: 1,
      pageSize: 100,
    }
    return this.http.get<any>(`${this.apiUrl}/logs/${this.company_id}?page=${1}&pageSize=${100}`, this.header);
  }
}
