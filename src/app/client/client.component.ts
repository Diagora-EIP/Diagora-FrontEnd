import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {
  token: string;
  invalidToken: boolean = false;
  deliverytmp: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string; deliveryHour: string; }[] = [];
  delivery: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string; deliveryHour: string; }[] = [];
  displayInfo: boolean = false;
  deliveryDislayed: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string; deliveryHour: string; } = {
    deliveryNumber: '',
    deliveryDate: '',
    deliveryStatus: '',
    deliveryHour: ''
  };
  search: string = "";

  constructor(private router: Router) {
    // get the token in the url /client/:token
    this.token = this.router.url.split('/')[2];

    if (!this.token) {
      this.invalidToken = true;
    }

    this.getAllDelivery();
  }

  onInputChange() {
    console.log("update", this.search)
    this.deliverytmp = this.delivery
    this.deliverytmp.forEach(elem =>{
      return this.deliverytmp.filter(item =>
        item.deliveryNumber.toLowerCase().includes(this.search.toLowerCase())
      );
    })
    //
  }

  getAllDelivery() {
    this.delivery = [
      {
        deliveryNumber: '123456',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123457',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123458',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123459',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123460',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123461',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123462',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123463',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      },
      {
        deliveryNumber: '123464',
        deliveryDate: '2021-09-10',
        deliveryStatus: 'En cours',
        deliveryHour: '14:00',
      }
    ];
    // this.deliverytmp = [];
    this.deliverytmp = this.delivery;
    // get all delivery with the token by api
  }

  showDelivery(deliveryNumber: string) {
    this.displayInfo = true;
    this.deliveryDislayed = this.delivery.find(delivery => delivery.deliveryNumber === deliveryNumber) as { deliveryNumber: string; deliveryDate: string; deliveryStatus: string; deliveryHour: string; };
    // class list-delivery -> with: 40%;

  }

}
