import { ViewChild, ElementRef, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { tap } from 'rxjs/operators';
import { ScheduleService } from '../services/schedule.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ManagerService } from '../services/manager.service';
import { PermissionsService } from '../services/permissions.service';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayjs from 'dayjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateScheduleModalComponent } from './modals/create-schedule-modal/create-schedule-modal.component';
import { UpdateScheduleModalComponent } from './modals/update-schedule-modal/update-schedule-modal.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';


interface User {
    name: string;
    user_id: number;
}

@Component({
    selector: 'app-full-calendar',
    templateUrl: 'schedule.component.html',
    styleUrls: ['schedule.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit {
    @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
    private calendarApi: any;
    currentStartDate: any;
    currentEndDate: any;
    managerControl = new FormControl();
    userList: any[] = [];
    filteredUsers: any[] = [];
    selectedDate: Date | null = null;
    filteredDates: Date[] = [];
    users: any[] = [];
    customHeaderText: string = localStorage.getItem('name') || '';
    currUser: User = { name: '', user_id: 0 };
    loading: boolean = false;
    updatingEvents: boolean = false;
    events = [];

    constructor(
        private scheduleService: ScheduleService,
        private managerService: ManagerService,
        private permissionsService: PermissionsService,
        private dialog: MatDialog,
        private cdref: ChangeDetectorRef,
        private ngZone: NgZone

    ) {
    }

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        editable: true,
        selectable: true,
        select: this.handleDateSelection.bind(this),
        events: (info, successCallback, failureCallback) => {
            this.currentStartDate = new Date(info.start.valueOf());
            this.currentEndDate = new Date(info.end.valueOf());

            let fetchEventsPromise: Promise<any>;

            if (this.checkPermission('manager'))
                fetchEventsPromise = this.getScheduleByUser();
            else
                fetchEventsPromise = this.getSchedule();

            fetchEventsPromise
                .then(events => {
                    const mappedEvents = events.map((event: any) => {
                        return this.mapScheduleToEvent(event)
                    });
                    successCallback(mappedEvents);
                })
                .catch(error => {
                    failureCallback(error);
                });
        },
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        eventClick: this.handleEventClick.bind(this),
        locales: [{ code: 'fr' }],
        buttonText: {
            today: 'Aujourd\'hui',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },
        firstDay: 1,
        titleFormat: (dateInfo) => {
            const timePadding = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
            const startDateString = new Date(dateInfo.start.marker.valueOf() + timePadding); // Add 15 days to the start date to get the month
            const formattedStartDate =
                dayjs(startDateString).format('MMMM YYYY');
            return this.customHeaderText + ' - ' + formattedStartDate;
        },
    };

    async ngOnInit(): Promise<void> {
        if (this.checkPermission('manager')) {
            await this.getManagerEntreprise();
        }
    }

    ngAfterViewInit() {
        this.cdref.detectChanges();
        this.fullcalendar.getApi().refetchEvents();
        this.calendarApi = this.fullcalendar.getApi();
        this.currentStartDate = this.calendarApi.view.currentStart;
        this.currentEndDate = this.calendarApi.view.currentEnd;
    }

    getSchedule(): Promise<any[]> {
        return new Promise((resolve, reject) => {

            this.ngZone.runOutsideAngular(() => {
                this.loading = true;
                const startDateFormatted = (this.currentStartDate?.setHours(0, 0, 0, 0) && this.currentStartDate.toISOString()) ||
                    new Date().toISOString();
                const endDateFormatted = (this.currentEndDate?.setHours(23, 59, 59, 999) && this.currentEndDate.toISOString()) ||
                    new Date().toISOString();

                this.scheduleService
                    .getScheduleBetweenDates(startDateFormatted, endDateFormatted)
                    .pipe(
                        tap({
                            next: (data: any) => {
                                this.ngZone.run(() => {
                                    this.loading = false;
                                    this.cdref.detectChanges();
                                });

                                if (!data || data.length === 0) {
                                    resolve([]); // Resolve with an empty array if no events
                                    return;
                                }
                                return resolve(data);
                            },
                            error: (err) => {
                                this.ngZone.run(() => {
                                    this.loading = false;
                                    this.cdref.detectChanges();
                                });
                                reject(err); // Reject with the error if any error occurs
                            },
                            complete: () => {
                                this.ngZone.run(() => {
                                    this.loading = false;
                                    this.cdref.detectChanges();
                                });
                            }
                        })
                    )
                    .subscribe();
            });
        });
    }

    async getScheduleByUser(): Promise<any[]> {
        return new Promise(async (resolve, reject) => {

            this.ngZone.runOutsideAngular(async () => {
                this.loading = true;

                const startDateFormatted = (this.currentStartDate?.setHours(0, 0, 0, 0) && this.currentStartDate.toISOString()) ||
                    new Date().toISOString();
                const endDateFormatted = (this.currentEndDate?.setHours(23, 59, 59, 999) && this.currentEndDate.toISOString()) ||
                    new Date().toISOString();
                if (this.checkPermission('manager') && this.currUser.user_id === 0) {
                    await this.getManagerEntreprise();
                }
                const user_id = this.currUser.user_id;

                if (user_id === undefined) {
                    return;
                }

                this.customHeaderText = this.managerControl.value.name;
                this.ngZone.runOutsideAngular(() => {
                    this.scheduleService
                        .getScheduleBetweenDatesByUser(
                            startDateFormatted,
                            endDateFormatted,
                            user_id
                        )
                        .pipe(
                            tap({
                                next: (data: any) => {
                                    this.ngZone.run(() => {
                                        this.loading = false;
                                        this.cdref.detectChanges();
                                    });
                                    if (!data || data.length === 0) {
                                        resolve([]);
                                        return;
                                    }
                                    return resolve(data);

                                },
                                error: (err) => {
                                    console.error('Error fetching schedule:', err);
                                    this.ngZone.run(() => {
                                        this.loading = false;
                                        this.cdref.detectChanges();
                                    });
                                    reject(err);
                                },
                                complete: () => {
                                    this.ngZone.run(() => {
                                        this.loading = false;
                                        this.cdref.detectChanges();
                                    });
                                }
                            })
                        )
                        .subscribe();
                });
            });
        });
    }

    // Helper function to map schedule data to CalendarEvent
    private mapScheduleToEvent(schedule: any): EventInput {
        return {
            title: schedule.order?.description,
            start: schedule.delivery_date,
            extendedProps: {
                scheduleId: schedule.schedule_id,
                order: {
                    orderId: schedule.order?.order_id,
                    orderDate: schedule.order?.order_date,
                    deliveryAddress: schedule.order?.delivery_address,
                    description: schedule.order?.description,
                    company: {
                        companyId: schedule.order?.company?.company_id,
                        name: schedule.order?.company?.name,
                        address: schedule.order?.company?.address,
                    },
                },
                itineraryId: schedule.itinerary_id,
                estimatedTime: schedule.estimated_time,
                actualTime: schedule.actual_time,
                status: schedule.status,
            },
        };
    }

    handleEventClick(info: any) {

        const extendedProps = info.event.extendedProps;
        const start = info.event.start.toISOString();
        const description = info.event.title
        const scheduleId = extendedProps.scheduleId.toString();
        const order = {
            orderId: extendedProps.order.orderId.toString(),
            orderDate: extendedProps.order.orderDate,
            deliveryAddress: extendedProps.order.deliveryAddress,
            description: extendedProps.order.description,
            company: {
                companyId: extendedProps.order.company.companyId.toString(),
                name: extendedProps.order.company.name,
                address: extendedProps.order.company.address,
            },
        };
        const itineraryId = extendedProps.itineraryId.toString();
        const estimatedTime = extendedProps.estimatedTime;
        const actualTime = extendedProps.actualTime;
        const status = extendedProps.status;
        const isManager = this.checkPermission('manager');
        let user: any = undefined;
        //code de merde a fix
        if (isManager) {
            user = this.userList.find(
                (user) => user.name === this.managerControl.value.name
            )
        } else {
            user = { user_id: this.permissionsService.getUserId(), name: "Moi" }
        }
        const dialogRef = this.dialog.open(UpdateScheduleModalComponent, {
            data: {
                start,
                description,
                scheduleId,
                order,
                itineraryId,
                estimatedTime,
                actualTime,
                status,
                manager: isManager,
                user: user
            }
        });

        let fetchEventsPromise: Promise<any>;

        dialogRef.afterClosed().subscribe(result => {
            if (this.checkPermission('manager'))
                fetchEventsPromise = this.getScheduleByUser();
            else
                fetchEventsPromise = this.getSchedule();


            fetchEventsPromise.then(events => {
                this.calendarOptions.events = events.map((event: any) =>
                    this.mapScheduleToEvent(event)
                );
                this.fullcalendar.getApi().refetchEvents();
            });
        });
    }

    async getManagerEntreprise(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    this.filteredUsers = response.users;
                    this.userList = response.users;
                    this.users = response.users;
                    localStorage.setItem('entreprise', response.name);
                    localStorage.setItem('addressEntreprise', response.address);
                    localStorage.setItem('company_id', response.company_id);
                    localStorage.setItem('users', JSON.stringify(response.users));
                    this.currUser = this.userList.find((user: User) => {
                        const nameCondition = user.name.toLowerCase() === localStorage.getItem('name')?.toLowerCase();
                        const idCondition = user.user_id === parseInt(localStorage.getItem('id') ?? '', 10);
                        return nameCondition && idCondition;
                    });
                    this.managerControl.setValue(this.currUser);
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getManagerEntreprise():", error);
                    reject(error);
                }
            });
        });
    }

    // Function to filter managers based on user input
    onManagerInput(event: any): void {
        const value = event.target.value;
        this.filteredUsers = this.filterManagers(value);
    }

    private filterManagers(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.users.filter((users) =>
            users.name.toLowerCase().includes(filterValue)
        );
    }

    displayManager(manager: any): string {
        return manager ? manager.name : '';
    }

    onManagerSelected(event: any): void {
        const selectedManager = event.option.value;
        this.currUser = { name: selectedManager.name, user_id: selectedManager.user_id };
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    // Inside your ScheduleComponent class
    handleDateSelection(selectInfo: any) {
        const start = selectInfo.startStr;
        const end = selectInfo.endStr;
        this.openEventCreationForm(start, end);
    }

    openEventCreationForm(start: string, end: string) {
        // Open the modal for event creation
        const isManager = this.checkPermission('manager');
        const currentUser = isManager ? this.currUser : { user_id: this.permissionsService.getUserId(), name: "Moi" };
        const dialogRef = this.dialog.open(CreateScheduleModalComponent, {
            data: { start, end, currUser: currentUser }
        });

        // this.fullcalendar.getApi().addEvent({
        //     title: 'New Event',
        //     start: start,
        //     end: end,
        //     allDay: false,
        // });
        let fetchEventsPromise: Promise<any>;

        dialogRef.afterClosed().subscribe(result => {
            if (!result)
                return;

            if (this.checkPermission('manager'))
                fetchEventsPromise = this.getScheduleByUser();
            else
                fetchEventsPromise = this.getSchedule();

            fetchEventsPromise.then(events => {
                this.calendarOptions.events = events.map((event: any) =>
                    this.mapScheduleToEvent(event)
                );
                this.fullcalendar.getApi().refetchEvents();
            });
        });
    }
}
