// Import necessary modules
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ScheduleService } from '../services/schedule.service';
import { ItineraryService } from '../services/itinerary.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss'],
})
export class CarteComponent implements AfterViewInit {

  map: any;
  routeSteps: string[] = [];
  scheduleData: any;
  itineraryData: any;
  date: string = new Date().toISOString().split('T')[0];
  itineraryLayer: any;
  selectedStepIndex: number | null = null;
  user: any
  redirectEventDate: any

  icon = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: 'assets/leaflet-logos/marker-icon.png',
      shadowUrl: 'assets/leaflet-logos/marker-shadow.png'
    })
  }

  constructor(
    private http: HttpClient,
    private scheduleService: ScheduleService,
    private itineraryService: ItineraryService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.has('date')) {
        this.redirectEventDate = params.get('date');

        const originalDate = new Date(this.redirectEventDate);
        const date = originalDate.toISOString().split('T')[0];
        this.date = date;
        this.cdr.detectChanges();
        this.initializeMap();

      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }


  initializeMap() {
    this.map = Leaflet.map('map', {
      center: [43.610769, 3.876716],
      zoom: 13
    });

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.getSchedule();
  }

  private getRouteSteps(itineraryData: any): string[] {
    const stops = itineraryData.path.points;
  
    if (!stops || stops.length === 0) {
      console.warn('No valid road data in the itinerary.');
      return [];
    }
  
    const routeSteps: string[] = [];
    for (let i = 0; i < stops.length; i++) {
      const currentStop = stops[i];

      const timeInSeconds = stops[i].arrive_at;
      const timeInMilliseconds = timeInSeconds * 1000;
      const date = new Date(timeInMilliseconds);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const nextStop = stops[i + 1];
      routeSteps.push(`${currentStop.address} - Arrivée prévue le ${formattedDate}`);
    }

    // routeSteps.push(`Deliver to: ${stops[stops.length - 1].address}`);

    return routeSteps;
  }

  private plotItinerary(itineraryData: any) {
    if (this.itineraryLayer) {
      this.map.removeLayer(this.itineraryLayer);
    }

    const road = itineraryData.stop_point.road;
    const stops = itineraryData.path.points;

    if (!road || road.length === 0 || !stops || stops.length === 0) {
      console.warn('No valid road data in the itinerary.');
      return;
    }

    const path_coordinates = road.map((point: any) => [point.y, point.x]);
    this.itineraryLayer = Leaflet.polyline(path_coordinates, { color: 'blue' }).addTo(this.map);


    stops.forEach((point: any) => {
      Leaflet.marker([point.y, point.x, point.address], this.icon).addTo(this.map)
        .bindPopup(`Address: ${point.address}<br>`)
        .openPopup();
    });

    const bounds = Leaflet.latLngBounds(path_coordinates);
    this.map.fitBounds(bounds);
  }

  selectStep(index: number): void {
    this.selectedStepIndex = index;
    if (this.itineraryData && this.itineraryData.path && this.itineraryData.path.points) {
      const selectedPoint = this.itineraryData.path.points[index];
      this.map.panTo([selectedPoint.y, selectedPoint.x]);
    }

    if (!this.routeSteps || this.routeSteps.length === 0) {
      this.displayDefaultMessage();
    }
  }

  private displayDefaultMessage() {
    const defaultMessage = 'No delivery steps available.';
    this.routeSteps = [defaultMessage];
  }

  getSchedule() {
    const startDateFormatted = this.date + 'T00:00:00.000Z';
    const endDateFormatted = this.date + 'T23:59:59.999Z';
  
    this.scheduleService.getScheduleBetweenDates(startDateFormatted, endDateFormatted)
      .pipe(
        tap({
          next: (data: any) => {
            this.scheduleData = data;
            localStorage.setItem('scheduleData', JSON.stringify(data));
  
            // Clear map and routeSteps if there is no data
            if (!data || data.length === 0) {
              this.clearMap();
              this.routeSteps = [];
              return;
            }
  
            const firstSchedule = data[0];
            const itineraryId = firstSchedule.itinerary_id;
            this.getItinerary(itineraryId);
          },
          error: (err) => {
            console.error('Error fetching schedule:', err);
          },
        }),
      )
      .subscribe();

      this.userService.getUserInfos()
      .pipe(
        tap({
          next: (data: any) => {
            console.log(data);
            this.user = data; // Assuming your user object is assigned to this.user
          },
          error: (err) => {
            console.error('Error fetching user:', err);
          },
        }),
      )
      .subscribe();
  }

  private clearMap() {
    if (this.itineraryLayer) {
      this.map.removeLayer(this.itineraryLayer);
    }
  
    // Clear all markers
    this.map.eachLayer((layer: any) => {
      if (layer instanceof Leaflet.Marker) {
        this.map.removeLayer(layer);
      }
    });
  
    this.routeSteps = [];
    this.selectedStepIndex = null;
  }

  getItinerary(itineraryId: string) {
    if (!itineraryId || itineraryId === '0')
      return;

    this.itineraryService.getItinerary(itineraryId)
      .pipe(
        tap({
          next: (data: any) => {
            this.itineraryData = data;
            localStorage.setItem('itineraryData', JSON.stringify(data));

            if (data) {
              this.routeSteps = this.getRouteSteps(data);
              this.plotItinerary(data);
            }
          },
          error: (err) => {
            console.error('Error fetching itinerary:', err);
          },
        }),
      )
      .subscribe();
  }
}
