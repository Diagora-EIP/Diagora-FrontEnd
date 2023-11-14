import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  token = localStorage.getItem('token');
  user_id = localStorage.getItem('id');

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

  async getOrders() {
    const response = await axios.get(this.apiUrl + '/orders/between-dates?begin=2023-11-09T00:00:00.000Z&end=2023-11-09T23:59:59.999Z', this.header);
    return response.data;
  }

  async createOrder(name: string, date: string, address: string) {
    const response = await axios.post(this.apiUrl + '/orders/create', { description: name, order_date: date, delivery_address: address, company_id: 0, order_status: 0, schedule_id: 0}, this.header);
    return response.data;
  }
}
