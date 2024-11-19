import { ViewChild, ElementRef, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { tap } from 'rxjs/operators';
import { ScheduleService } from '../services/schedule.service';
import { TeamService } from '../services/team.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ManagerService } from '../services/manager.service';
import { PermissionsService } from '../services/permissions.service';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { MatDialog } from '@angular/material/dialog';
import { CreateScheduleModalComponent } from './modals/create-schedule-modal/create-schedule-modal.component';
import { UpdateScheduleModalComponent } from './modals/update-schedule-modal/update-schedule-modal.component';
import { PropositionComponent } from './modals/delivery-proposition-modal/create-proposition-modal';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';
// import teamjson from './teams.json';

dayjs.locale('fr');

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
    users: any[] = [];
    customHeaderText: string = localStorage.getItem('name') || '';
    currUser: User = { name: '', user_id: 0 };
    loading: boolean = false;
    events = [];
    private selectedUsersCache: { [userId: number]: any } = {};
    private currentEventsCache: any[] = [];

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
        initialView: 'timeGridWeek',
        locale: 'fr',
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        editable: true,
        selectable: true,
        select: this.handleDateSelection.bind(this),
        events: (info, successCallback, failureCallback) => {
            console.log(info)
            this.currentStartDate = new Date(info.start.valueOf());
            this.currentEndDate = new Date(info.end.valueOf());

            let fetchEventsPromise: Promise<any>;

            // Always fetch events using getSchedule
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
            console.log(fetchEventsPromise)
        },
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        eventClick: this.handleEventClick.bind(this),
        buttonText: {
            today: 'Aujourd\'hui',
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },
        firstDay: 1,
        titleFormat: (dateInfo) => {
            const timePadding = 24 * 60 * 60 * 1000; // 1 day in milliseconds
            const startDateString = new Date(dateInfo.start.marker.valueOf() + timePadding);
            const formattedStartDate = dayjs(startDateString).format('MMMM YYYY');
            return this.customHeaderText + ' - ' + formattedStartDate;
        },
    };

    async ngOnInit(): Promise<void> {
        if (this.checkPermission('manager') || this.checkPermission('team leader')) {
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
                                    resolve([]);
                                    return;
                                }
                                return resolve(data);
                            },
                            error: (err) => {
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
    }

    async newgetScheduleByUser(userId: any): Promise<any[]> {
        return new Promise(async (resolve, reject) => {

            this.ngZone.runOutsideAngular(async () => {
                // this.loading = true;

                const startDateFormatted = (this.currentStartDate?.setHours(0, 0, 0, 0) && this.currentStartDate.toISOString()) ||
                    new Date('2020-01-01T00:00:00Z').toISOString();

                const endDateFormatted = (this.currentEndDate?.setHours(23, 59, 59, 999) && this.currentEndDate.toISOString()) ||
                    new Date('2025-12-31T23:59:59Z').toISOString();

                if ((this.checkPermission('manager') || this.checkPermission('team leader')) && this.currUser.user_id === 0) {
                    await this.getManagerEntreprise();
                }
                console.log('userId:', userId);
                const user_id = userId;

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
            color: schedule.color,
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
                user: {
                    user_id: schedule.user?.user_id,
                    name: schedule.user?.name,
                    color: schedule.user?.color,
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
        const isManager = this.checkPermission('manager') || this.checkPermission('team leader') ;
        let user: any = extendedProps.user;

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

        dialogRef.afterClosed().subscribe(result => {
            // After creating or updating an event, refresh the calendar
            if (result) {
                this.fullcalendar.getApi().refetchEvents();
            }
        });
    }

    handleCompanyDataChange(companyData: any): void {
        // Handle company data
        console.log('Company data:', companyData);
    }

    handleSelectedDataChange(selectedData: { teams: { [teamId: number]: any[] }, usersWithoutTeams: any[] }): void {
        // Create a new object to track current selected users
        const currentSelectedUsers: { [userId: number]: any } = {};

        // Collect all users from selected teams
        for (const teamId in selectedData.teams) {
            if (selectedData.teams.hasOwnProperty(teamId)) {
                selectedData.teams[teamId].forEach(user => {
                    currentSelectedUsers[user.user_id] = user;
                });
            }
        }

        // Collect all users without teams
        selectedData.usersWithoutTeams.forEach(user => {
            currentSelectedUsers[user.user_id] = user;
        });

        // console.log("CurrentSelectedUsers", currentSelectedUsers)

        // Identify users that were previously selected but are no longer selected
        const unselectedUserIds = Object.keys(this.selectedUsersCache).filter(
            userId => !currentSelectedUsers[parseInt(userId)]
        );

        if (unselectedUserIds.length > 0) {
            // console.log('Unselected users:', unselectedUserIds);
            // Remove from the current events the users that were unselected
            const filteredEvents = this.currentEventsCache.filter(
                event => !unselectedUserIds.includes(event.user.user_id.toString())
            );
            this.currentEventsCache = filteredEvents;
        }

        // Update the cache with the current selection
        this.selectedUsersCache = { ...currentSelectedUsers };

        if (Object.keys(currentSelectedUsers).length === 0) {
            this.currentEventsCache = [];
            this.fullcalendar.getApi().removeAllEvents();
            return;
        }

        // Fetch schedules for newly selected users
        const fetchEventsPromises = Object.keys(currentSelectedUsers).map(userId => {
            return this.newgetScheduleByUser(parseInt(userId));
        });

        // Handle the fetched events
        Promise.all(fetchEventsPromises)
            .then(eventsArrays => {
                console.log(eventsArrays);
                const allEvents = eventsArrays.flat();

                allEvents.forEach((event: any) => {
                    console.log(event);
                    const user_id = event.user.user_id;

                    // Default to the user's color
                    // console.log('SelectedUsersCache:', this.selectedUsersCache);
                    try {
                        // console.log('User_id:', user_id);
                        // console.log('SelectedUsersCache:', this.selectedUsersCache[user_id]);
                    } catch (error) {
                        console.log('Error:', error);
                    }
                    let eventColor = this.selectedUsersCache[user_id].color;

                    // Check if the user belongs to a selected team and override with the team color if applicable
                    console.log(selectedData)
                    if (selectedData.teams) {
                        for (const teamId in selectedData.teams) {
                            if (selectedData.teams.hasOwnProperty(teamId)) {
                                const team = selectedData.teams[teamId] as { user_id: number, teamColor: string }[];

                                const userInTeam = team.find(user => user.user_id === user_id);

                                if (userInTeam) {
                                    eventColor = userInTeam.teamColor;
                                }
                            }
                        }
                    }

                    event.color = eventColor;
                });

                // Update the current events cache
                this.currentEventsCache = allEvents;

                // Update the calendar events
                const mappedEvents = allEvents.map((event: any) => this.mapScheduleToEvent(event));
                const calendarApi = this.fullcalendar.getApi();
                calendarApi.removeAllEvents();
                calendarApi.addEventSource(mappedEvents);

                this.cdref.detectChanges();

            })
            .catch(error => {
            });
    }

    async getManagerEntreprise(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    this.currUser = {
                        name: localStorage.getItem('name') || "undefined",
                        user_id: Number(localStorage.getItem('id')) || 0
                    };
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

    displayManager(manager: any): string {
        return manager ? manager.name : '';
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    handleDateSelection(selectInfo: any) {
        const start = selectInfo.startStr;
        const end = selectInfo.endStr;
        this.openEventCreationForm(start, end);
    }

    openEventCreationForm(start: string, end: string) {
        // Open the modal for event creation
        const isManager = this.checkPermission('manager') || this.checkPermission('team leader');
        const currentUser = isManager ? this.currUser : { user_id: this.permissionsService.getUserId(), name: "Moi" };
        const dialogRef = this.dialog.open(CreateScheduleModalComponent, {
            data: { start, end, currUser: currentUser }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fullcalendar.getApi().refetchEvents();
            }
        });
    }

    // Proposition Modal
    openPropositionModal() {
        const dialogRef = this.dialog.open(PropositionComponent, {
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
