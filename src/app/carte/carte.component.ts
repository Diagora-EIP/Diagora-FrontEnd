import { Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet'; 

// Leaflet.Icon.Default.imagePath = 'assets/'; 

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss']
})
export class CarteComponent implements AfterViewInit {
  latitude: number = 18.5204;
  longitude: number = 73.8567;
  map: any;
  begin!: string;
  end!: string;
  markers: any = [];
  travel: any = [];
  disp: boolean = false;
  smallIcon = new Leaflet.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
  });

  constructor(private router: Router, private route: ActivatedRoute) { }
  ngAfterViewInit(): void {
    this.AfterViewInit();
  }

  async AfterViewInit() {
    const date = this.route.snapshot.paramMap.get('date')
    if (date == null) {
      alert("Veuillez choisir une date")
      this.router.navigate(['/home'])
      return
    }
    let test = new Date(date)
    this.map = Leaflet.map('map', {
      center: [43.610769, 3.876716],
      zoom: 11
    })
    const layer = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    layer.addTo(this.map)
    const token = localStorage.getItem('token');
    let id = 31;
    let begin = new Date(test.getTime() + 5*0*0*1000)
    let end = new Date(test.getTime() + 23*59*59*1000)
    this.begin = begin.toISOString()
    this.end = end.toISOString()
    let link = 'http://20.111.8.106:3000/user/' + id + '/itinary/?begin=' + this.begin + '&end=' + this.end;
    console.log(link)
    const response = await fetch(link, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
      },
    });
    response.json().then(data => {
      console.log(data)
      let point_list = data[data.length - 1];
      console.log(point_list)
      if (point_list == undefined) {
          this.disp = true
          alert("Aucune livraison n'est à effectuer sur cette période")
          return
      }
      for (let y = 0; y < point_list.stop_point.length; y++) {
        let mark = Leaflet.marker([point_list.stop_point[y].lat, point_list.stop_point[y].long], {icon: this.smallIcon});
        mark.addTo(this.map);
        this.markers[y] = {
          adress: point_list.stop_point[y].adress,
          begin: point_list.stop_point[y].begin.slice(11, 16),
          end: point_list.stop_point[y].end.slice(11, 16),
          lat: point_list.stop_point[y].lat,
          lng: point_list.stop_point[y].long
        }
      }
      for (let y = 0; y < point_list.path.length; y++) {
        for (let x = 0; x < point_list.path[y].path.length; x++) {
          this.travel[x] = [point_list.path[y].path[x].lat, point_list.path[y].path[x].lon]
        }
      }
      let poly = Leaflet.polyline(this.travel, {color: 'red'});
      poly.addTo(this.map);
      this.disp = true
    });
  }
}
declare var ol: any;
