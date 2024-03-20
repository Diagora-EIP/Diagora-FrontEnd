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
  deliverytmp: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string}[] = [];
  delivery: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string}[] = [];
  displayInfo: boolean = false;
  deliveryDislayed: { deliveryNumber: string; deliveryDate: string; deliveryStatus: string} = {
    deliveryNumber: '',
    deliveryDate: '',
    deliveryStatus: '',
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
    this.deliverytmp = this.delivery
    this.deliverytmp = this.deliverytmp.filter(elem =>
      elem.deliveryNumber.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  getAllDelivery() {
    this.delivery = [
      {
        deliveryNumber: '123456',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123457',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123458',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123459',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123460',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123461',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123462',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123463',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      },
      {
        deliveryNumber: '123464',
        deliveryDate: '09/01/2024 06:00:00',
        deliveryStatus: 'En cours',
      }
    ];
    this.deliverytmp = this.delivery;
  }

  showDelivery(deliveryNumber: string) {
    this.displayInfo = true;
    this.deliveryDislayed = this.delivery.find(delivery => delivery.deliveryNumber === deliveryNumber) as { deliveryNumber: string; deliveryDate: string; deliveryStatus: string};
  }

}
