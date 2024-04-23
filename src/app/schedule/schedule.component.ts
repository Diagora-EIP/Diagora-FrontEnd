// full-calendar.component.ts
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

interface User {
    name: string;
    user_id: number;
}

@Component({
    selector: 'app-full-calendar',
    templateUrl: 'schedule.component.html',
    styleUrls: ['schedule.component.scss'],
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
    currUser: User = { name: '', user_id: 0};
    loading: boolean = false;
    updatingEvents: boolean = false;


    constructor(
        private scheduleService: ScheduleService,
        private managerService: ManagerService,
        private permissionsService: PermissionsService,
        private router: Router,
		private dialog: MatDialog,
        private cdref: ChangeDetectorRef

    ) {
        
    }

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        events: [],
        editable: true,
        selectable: true,
        select: this.handleDateSelection.bind(this),
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        eventClick: this.handleEventClick.bind(this),
        datesSet: this.handleDateClick.bind(this),
        locales: [{ code: 'fr' }],
        buttonText: {
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },
        titleFormat: (dateInfo) => {
            const startDateString = dateInfo.start.marker;
            const formattedStartDate =
			dayjs(startDateString).format('MMMM YYYY');
            return this.customHeaderText + ' - ' + formattedStartDate;
        },
    };

    ngOnInit(): void {
        if (this.checkPermission('manager')) {
            this.getManagerEntreprise();
        }
        this.calendarOptions.events = [];
    }

    ngAfterViewInit() {
        this.cdref.detectChanges();
        this.calendarOptions.events = [];
        this.fullcalendar.getApi().refetchEvents();
        this.calendarApi = this.fullcalendar.getApi();
        this.currentStartDate = this.calendarApi.view.currentStart;
        this.currentEndDate = this.calendarApi.view.currentEnd;
        // this.getSchedule();
    }

    onDateSelected(event: any): void {
        // Handle date selection logic here if needed
        // This method should be defined in your component
    }

    getSchedule() {
        console.trace('getSchedule() was called by:');
        this.loading = true;
        const startDateFormatted = (this.currentStartDate?.setHours(0, 0, 0, 0) && this.currentStartDate.toISOString()) || new Date().toISOString();
        const endDateFormatted = (this.currentEndDate?.setHours(23, 59, 59, 999) && this.currentEndDate.toISOString()) || new Date().toISOString();
        if (this.updatingEvents === false) {
            this.updatingEvents = true;
            this.scheduleService
                .getScheduleBetweenDates(startDateFormatted, endDateFormatted)
                .pipe(
                    tap({
                        next: (data: any) => {
                            this.loading = false;
                            this.updatingEvents = true;

                            if (!data || data.length === 0) {
                                this.calendarOptions.events = [];
                                return;
                            }

                            this.calendarOptions.events = data.map((event: any) =>
                                this.mapScheduleToEvent(event)
                            );
                            
                        },
                        error: (err) => {
                            this.loading = false; // Set loading to false on error too
                            this.updatingEvents = false;
                        },
                        complete: () => {
                            this.loading = false; // Set loading to false on completion too
                            this.updatingEvents = false;
                        }
                    })
                )
                .subscribe();
        }
    }

    getScheduleByUser() {
        const startDateFormatted =
            (this.currentStartDate?.setHours(0, 0, 0, 0) &&
                this.currentStartDate.toISOString()) ||
            new Date().toISOString();
        const endDateFormatted =
            (this.currentEndDate?.setHours(23, 59, 59, 999) &&
                this.currentEndDate.toISOString()) ||
            new Date().toISOString();

        const user_id = this.userList.find(
            (user) => user.name === this.managerControl.value.name && user.user_id === this.managerControl.value.user_id
        )?.user_id;

        if (user_id === undefined) {
            return;
        }

        this.customHeaderText = this.managerControl.value.name;

        this.scheduleService
            .getScheduleBetweenDatesByUser(
                startDateFormatted,
                endDateFormatted,
                user_id
            )
            .pipe(
                tap({
                    next: (data: any) => {
                        localStorage.setItem(
                            'scheduleData',
                            JSON.stringify(data)
                        );

                        // Clear events if no data
                        if (!data || data.length === 0) {
                            this.calendarOptions.events = [];
                            return;
                        }

                        // Update events in calendarOptions
                        this.calendarOptions.events = data.map((event: any) =>
                            this.mapScheduleToEvent(event)
                        );
                        this.fullcalendar.getApi().refetchEvents();
                    },
                    error: (err) => {
                        console.error('Error fetching schedule:', err);
                    },
                })
            )
            .subscribe();
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
        // 'info' contains information about the clicked event
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

		const dialogRef = this.dialog.open(UpdateScheduleModalComponent, {
            width: '400px', // Set the desired width
            data: {
				start,
				description,
				scheduleId,
				order,
				itineraryId,
				estimatedTime,
				actualTime,
				status,
				manager: this.checkPermission('manager'),
				user:	this.userList.find(
							(user) => user.name === this.managerControl.value.name
						)
			}
        });



		dialogRef.afterClosed().subscribe(result => {
            // Handle the result if needed (e.g., check if the user submitted the form)
			if (this.checkPermission('manager')) {
				this.getScheduleByUser();
			} else {
                console.log("here eventlcick")
				this.getSchedule();
			}
        });
    }

    getManagerEntreprise() {
        this.managerService
            .getManagerEntreprise()
            .subscribe((response: any) => {
                this.filteredUsers = response.users;
                this.userList = response.users;
                this.users = response.users;
                this.currUser = this.userList.find((user: User) => {
                    const nameCondition = user.name.toLowerCase() === localStorage.getItem('name')?.toLowerCase();
                    const idCondition = user.user_id === parseInt(localStorage.getItem('id') ?? '', 10);
                    return nameCondition && idCondition;
                });
                this.managerControl.setValue(this.currUser);
            })
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
        console.log('Selected manager:', selectedManager);
        this.currUser = {name: selectedManager.name, user_id: selectedManager.user_id};
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    handleDateClick(arg: any) {
        const visibleStart = arg.view.activeStart;
        const visibleEnd = arg.view.activeEnd;

        this.currentStartDate = visibleStart;
        this.currentEndDate = visibleEnd;
        console.log("loopping ????", this.updatingEvents)

        if (this.checkPermission('manager')) {
            this.getScheduleByUser();
        } else {
            this.getSchedule();
        }
    }

    // Inside your ScheduleComponent class
    handleDateSelection(selectInfo: any) {
		const start = selectInfo.startStr;
		const end = selectInfo.endStr;
		this.openEventCreationForm(start, end);
    }

	openEventCreationForm(start: string, end: string) {
        // Open the modal for event creation
        const dialogRef = this.dialog.open(CreateScheduleModalComponent, {
            width: '400px',
            data: { start, end, currUser: this.currUser }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (this.checkPermission('manager')) {
                setTimeout(() => {
                    this.getScheduleByUser();
                }, 1000); // Delay for 1 second
            } else {
                setTimeout(() => {
                    this.getSchedule();
                }, 1000); // Delay for 1 second
            }
        });
	}
}
