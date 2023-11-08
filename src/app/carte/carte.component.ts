import { Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet'; 
import 'leaflet-routing-machine';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements AfterViewInit {
  map: any;

  constructor(private router: Router, private route: ActivatedRoute) { }
  ngAfterViewInit(): void {
    this.AfterViewInit();
  }

  async AfterViewInit() {
    this.map = Leaflet.map('map', {
      center: [43.610769, 3.876716],
      zoom: 13
    })
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    Leaflet.Routing.control({
      waypoints: [
          Leaflet.latLng(43.60736092283879, 3.8862490891347337),
          Leaflet.latLng(43.6536727097425, 3.883608027741413)
      ],
      routeWhileDragging: true
  }).addTo(this.map);
  }
}