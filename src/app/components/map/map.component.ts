import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterViewInit,
    OnChanges,
    Input,
    ViewChild,
    ElementRef,
    SimpleChanges,
    ChangeDetectorRef,
    NgZone,
} from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';

import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';

import { DestroyService } from '../../services/destroy.service';
import { ScheduleService } from '../../services/schedule.service';
import { ItineraryService } from '../../services/itinerary.service';
import { PermissionsService } from '../../services/permissions.service';
import { FollowUpService, FollowUpPoint, FollowUpSchedule } from '../../services/follow-up.service';
import { UtilsService } from '../../services/utils.service';

type RouteStep = {
    address: string;
    arrive_at: string;
    finished: boolean;
};

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.--app-map-sider-width]': 'siderWidth || null',
    },
    providers: [
        DestroyService,
        ScheduleService,
        ItineraryService,
        FollowUpService,
    ],
})
export class MapComponent implements AfterViewInit, OnChanges {
    @Input() userId?: number;
    @Input() dateStr?: string; // format: 'YYYY-MM-DD'
    // @Input() date?: Date;
    @Input() siderWidth?: string;

    @ViewChild('mapElem', { static: false, read: ElementRef }) mapElement!: ElementRef<HTMLDivElement>;
    private onInputChanged$ = new Subject<void>();
    private onDataUpdated$ = new Subject<void>();

    schedules: FollowUpSchedule[] = [];
    selectedSchedule: FollowUpSchedule | null = null;
    points: FollowUpPoint[] = [];
    itinerary: any | null = null;
    routeSteps: RouteStep[] = [];
    map: Leaflet.Map | null = null;
    fetchedPermissions: boolean = false;

    // for followUpService
    isLoading: boolean = true;
    isError: boolean = false;
    // for scheduleService
    isLoadingSchedule: boolean = false;
    isErrorSchedule: boolean = false;
    // for itineraryService
    isLoadingItinerary: boolean = false;
    isErrorItinerary: boolean = false;

    icon: Leaflet.MarkerOptions = {
        icon: Leaflet.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 0],
            iconUrl: 'assets/leaflet-logos/marker-icon.png',
            shadowUrl: 'assets/leaflet-logos/marker-shadow.png',
        }),
    };

    private formatDate(date: Date, addDays: number): string | null { // add one day to the date, because the follow-up is bad coded
        if (!date || isNaN(date.getTime())) {
            return null;
        }
        const day = date.getDate();
        const newDay = String(day + addDays).padStart(2, '0');
        const month = date.getMonth() + 1;
        const newMonth = String(month).padStart(2, '0');
        const year = date.getFullYear();
        const newYear = String(year).padStart(4, '0');

        return `${newYear}-${newMonth}-${newDay}`;
    }

    private get dateFormatted(): string | null {
        if (this.dateStr) {
            const newDate = new Date(this.dateStr);
            // return this.formatDate(new Date(this.dateStr), 0);
            return this.dateStr;
        }
        // if (this.date) {
        //     return this.formatDate(this.date, 0);
        // }
        return null;
    }

    private init(): void {
        if (!this.userId || !this.dateFormatted) {
            this.isLoading = false;
            this.isError = true;
            // console.log("this.userId", this.userId)
            // console.log("this.dateFormatted", this.dateFormatted)
            // console.error('MapComponent: Missing userId or date input');
            this.cdr.detectChanges();
            if (!this.userId) {
                this.userId = +(this.utilsService.getUserId() || 0);
            }
            return;
        }
        // we put them here, because if this method is called again, we want to reset the values
        this.schedules = [];
        this.selectedSchedule = null;
        this.points = [];

        this.isLoading = true;
        this.isError = false;

        this.isLoadingSchedule = false;
        this.isErrorSchedule = false;

        this.isLoadingItinerary = false;
        this.isErrorItinerary = false;

        this.routeSteps = [];
        this.itinerary = null;
        this.map = null;

        const startDependingOnPermissions = () => {
            if ((this.checkPermission('manager') || this.checkPermission('team leader')) && this.userId !== undefined && this.userId !== 0) {
                // this.fetchUserSchedules(); // debug
                this.followUpService.init(this.userId, this.dateFormatted!);
            } else {
                this.fetchUserSchedules();
            }
        };

        if (this.fetchedPermissions) {
            startDependingOnPermissions();
        } else {
            this.permissionsService.userPermissionsSubject.pipe(
                take(1),
                tap(() => {
                    this.fetchedPermissions = true;
                    startDependingOnPermissions();
                })
            ).subscribe();
        }
    }

    private findScheduleWithItineraryId(): FollowUpSchedule | null {
        if (this.schedules.length === 0) {
            return null;
        }

        const found = this.schedules.find((schedule) => {
            const itineraryId = schedule.itinerary_id;
            if (!itineraryId || !Number(itineraryId) || itineraryId === 0) {
                return false;
            }
            return true;
        });

        if (found) {
            return found;
        }

        return this.schedules[0];
    }

    private onDataUpdated() {
        if (this.selectedSchedule == null && this.schedules.length > 0) {
            this.selectedSchedule = this.findScheduleWithItineraryId();
            this.fetchSchedule();
        }

        if (this.isLoading) {
            this.isLoading = false;
            this.cdr.markForCheck();
            this.initMap();
        }

        this.renderMap();
        this.cdr.markForCheck();
    }

    private getRouteSteps(itineraryData: any): RouteStep[] {
        const stops = itineraryData.path.points;

        if (!stops || stops.length === 0) {
            return [];
        }

        const routeSteps: RouteStep[] = [];
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
                minute: '2-digit',
            });

            let isFinished = false;
            // if a point is registered, we consider that the first one (departure) is finished
            if (isFinished === false && i === 0 && this.points.length > 0) {
                isFinished = true;
            }
            // if schedule with the same adress and status 1 is found, we consider that the point is finished
            if (isFinished === false && this.schedules.find((schedule) => (schedule as any).status === 1 && currentStop.address === (schedule as any).order?.delivery_address)) {
                isFinished = true;
            }
            // if schedule with the same adress and order_status 1 is found, we consider that the point is finished
            if (isFinished === false && this.schedules.find((schedule) => (schedule as any).order_status === 1 && currentStop.address === (schedule as any).order?.delivery_address)) {
                isFinished = true;
            }

            routeSteps.push({
                address: currentStop.address,
                arrive_at: `Arrivée prévue le ${formattedDate}`,
                finished: isFinished,
            });
        }

        return routeSteps;
    }

    private fetchUserSchedules() {
        const startDate = this.dateFormatted + 'T00:00:00.000Z';
        const endDate = this.dateFormatted + 'T23:59:59.999Z';

        this.scheduleService
            .getScheduleBetweenDates(startDate, endDate)
            .pipe(
                tap({
                    next: (data: any) => {
                        this.schedules = data;
                        this.isLoading = false;
                        this.isError = false;
                        this.initMap();
                        this.onDataUpdated$.next();
                        this.cdr.markForCheck();
                    },
                    error: (err: any) => {
                        this.isLoading = false;
                        this.isError = true;
                    },
                })
            )
            .subscribe();
    }

    private fetchItinerary(itineraryId: number): void {
        this.isLoadingItinerary = true;

        this.itineraryService
            .getItinerary(`${itineraryId}`)
            .pipe(
                tap({
                    next: (data: any) => {
                        this.isLoadingItinerary = false;
                        this.isErrorItinerary = false;
                        this.routeSteps = this.getRouteSteps(data);
                        this.itinerary = data;
                        this.renderMap();
                        this.cdr.markForCheck();
                    },
                    error: (err) => {
                        this.isLoadingItinerary = false;
                        this.isErrorItinerary = true;
                        console.error('Error fetching itinerary:', err);
                    },
                })
            )
            .subscribe();
    }

    private fetchSchedule(): void {
        if (!this.selectedSchedule || !this.selectedSchedule.schedule_id) {
            this.isErrorSchedule = true;
            return;
        }
        this.isLoadingSchedule = true;
        const scheduleId = Number(this.selectedSchedule.schedule_id);

        this.scheduleService
            .getScheduleById(scheduleId)
            .pipe(
                tap({
                    next: (data: any) => {
                        this.isLoadingSchedule = false;
                        this.isErrorSchedule = false;
                        const itineraryId = data.itinerary_id;
                        if (!itineraryId || !Number(itineraryId)) {
                            this.isErrorItinerary = true;
                            this.cdr.markForCheck();
                            return;
                        }
                        this.fetchItinerary(itineraryId);
                        this.cdr.markForCheck();
                    },
                    error: (err: any) => {
                        this.isLoadingSchedule = false;
                        this.isErrorSchedule = true;
                        console.error('Error fetching schedule:', err);
                    },
                })
            )
            .subscribe();
    }

    private clearMapLayers(): void {
        if (this.map) {
            this.map.eachLayer((layer) => {
                if (layer instanceof Leaflet.Marker) {
                    this.map!.removeLayer(layer);
                }
                if (layer instanceof Leaflet.Polyline) {
                    this.map!.removeLayer(layer);
                }
            });
        }
    }

    private renderPoints(): void {
        if (!this.map) {
            return;
        }
        if (this.points.length === 0) {
            return;
        }

        const polylinePoints: Leaflet.LatLngExpression[] = this.points.map((point) => {
            return [Number(point.latitude), Number(point.longitude)];
        });
        const polyline = Leaflet.polyline(polylinePoints, { color: 'red' }).addTo(this.map);

        if (!this.routeSteps.length) {
            this.map.fitBounds(polyline.getBounds());
        }

        return;
    }

    private renderItinerary(): void {
        if (!this.map) {
            return;
        }
        if (!this.itinerary) {
            return;
        }

        const road = this.itinerary.stop_point.road;
        const stops = this.itinerary.path.points;

        if (!road || road.length === 0 || !stops || stops.length === 0) {
            return;
        }

        const path_coordinates = road.map((point: any) => [point.y, point.x]);
        const polyline = Leaflet.polyline(path_coordinates, {
            color: 'blue',
        }).addTo(this.map);

        stops.forEach((point: any) => {
            Leaflet.marker([point.y, point.x, point.address], this.icon)
                .addTo(this.map!)
                .bindPopup(`Adresse: ${point.address}<br>`)
                .openPopup();
        });

        this.map.fitBounds(polyline.getBounds());
    }

    private renderMap(): void {
        if (!this.map) {
            return;
        }

        this.clearMapLayers();
        this.renderPoints();
        this.renderItinerary();
    }

    private initMap(): void {
        if (!this.map) {
            this.zone.onMicrotaskEmpty
                .pipe(
                    takeUntil(this.destroy$),
                    take(1),
                )
                .subscribe(() => {
                    const defaultPosition: Leaflet.LatLngExpression = this.points.length > 0 ?
                        [Number(this.points[0].latitude), Number(this.points[0].longitude)] :
                        [43.610769, 3.876716];

                    this.map = Leaflet.map(this.mapElement.nativeElement, {
                        center: defaultPosition,
                        zoom: 13,
                    });

                    Leaflet.tileLayer(
                        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ).addTo(this.map);

                    this.renderMap();
                    this.cdr.markForCheck();
                });
        }
    }

    private checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    public selectStep(index: number): void {
        if (
            this.itinerary &&
            this.itinerary.path &&
            this.itinerary.path.points
        ) {
            const selectedPoint = this.itinerary.path.points[index];
            this.map!.panTo([selectedPoint.y, selectedPoint.x]);
        }
    }

    constructor(
        private destroy$: DestroyService,
        private followUpService: FollowUpService,
        private scheduleService: ScheduleService,
        private itineraryService: ItineraryService,
        private permissionsService: PermissionsService,
        private cdr: ChangeDetectorRef,
        private zone: NgZone,
        private utilsService: UtilsService,
    ) {
    }

    ngAfterViewInit(): void {
        this.followUpService.onError$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isLoading = false;
                this.isError = true;
            });

        this.followUpService.points$
            .pipe(takeUntil(this.destroy$))
            .subscribe((points) => {
                this.points = points;
                this.onDataUpdated$.next();
                this.cdr.markForCheck();
            });

        this.followUpService.schedules$
            .pipe(takeUntil(this.destroy$))
            .subscribe((schedules) => {
                this.schedules = schedules;
                this.onDataUpdated$.next();
                this.cdr.markForCheck();
            });

        this.onDataUpdated$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.onDataUpdated();
            });

        this.onInputChanged$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.init();
            });

        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { userId, dateStr, date } = changes;

        if (userId || dateStr || date) {
            this.onInputChanged$.next();
        }
    }
}
