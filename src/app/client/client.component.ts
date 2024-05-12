import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  token: string;
  invalidToken: boolean = false;
  deliverytmp: { order_id: any; order_date: string; order_hour: string; delivery_address: string, description: string; companyName: string; schedule_number: string }[] = [];
  delivery: { order_id: any; order_date: string; order_hour: string; delivery_address: string, description: string; companyName: string; schedule_number: string }[] = [];
  displayInfo: boolean = false;
  deliveryDislayed: { order_id: any; order_date: string; order_hour: string; delivery_address: string, description: string; companyName: string; schedule_number: string } = {
    order_id: '',
    order_date: '',
    order_hour: '',
    delivery_address: '',
    description: '',
    companyName: '',
    schedule_number: ''
  };
  search: string = "";
  displayFilter: boolean = false;

  constructor(private router: Router, private clientService: ClientService) {
    // get the token in the url /client/:token
    this.token = this.router.url.split('/')[2];

    localStorage.setItem('token', this.token);
    if (!this.token) {
      this.invalidToken = true;
    } else {
      this.getAllDelivery();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    localStorage.removeItem('token');
  }

  deleteFilter() {
    this.deliverytmp = this.delivery;
    this.search = '';
    this.displayFilter = false;
  }

  filterDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('filter date', type, event.value);
    const dateDelivery = event.value;
    if (!dateDelivery) {
      return;
    }
    const date = `${dateDelivery.getDate().toString().padStart(2, '0')}/${(dateDelivery.getMonth() + 1).toString().padStart(2, '0')}/${dateDelivery.getFullYear()}`;
    this.deliverytmp = this.delivery
    this.deliverytmp = this.deliverytmp.filter(elem =>
      elem.order_date.includes(date)
    );
  }

  onInputChange() {
    this.deliverytmp = this.delivery
    this.deliverytmp = this.deliverytmp.filter(elem =>
      elem.schedule_number.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  getAllDelivery() {
    const header = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    };
    this.clientService.getOrderByClient(header).subscribe(
      (data: any) => {
        const delivery: { order_id: any; order_date: string; order_hour: string; delivery_address: string, description: string; companyName: string; schedule_number: string }[] = [];
        for (let i = 0; i < data.length; i++) {
          const dateDelivery = new Date(data[i].order_date);
          console.log(data[i].order_date);
          delivery.push({
            order_id: data[i].order_id,
            order_date: `${dateDelivery.getDate().toString().padStart(2, '0')}/${(dateDelivery.getMonth() + 1).toString().padStart(2, '0')}/${dateDelivery.getFullYear()}`,
            order_hour: `${dateDelivery.getUTCHours().toString().padStart(2, '0')}:${dateDelivery.getUTCMinutes().toString().padStart(2, '0')}`,
            delivery_address: data[i].delivery_address,
            description: data[i].description,
            companyName: data[i].company.name,
            schedule_number: data[i].schedule_number
          });
        }
        this.delivery = delivery;
        this.deliverytmp = this.delivery;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showDelivery(schedule_number: string) {
    this.displayInfo = true;
    this.deliveryDislayed = this.delivery.find(delivery => delivery.schedule_number === schedule_number) as { order_id: string; order_date: string; order_hour: string; delivery_address: string, description: string; companyName: string; schedule_number: string};
  }

}
