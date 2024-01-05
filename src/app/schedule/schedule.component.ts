// full-calendar.component.ts
import { ViewChild, ElementRef, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { tap } from 'rxjs/operators';
import { ScheduleService } from '../services/schedule.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-full-calendar',
  templateUrl: 'schedule.component.html',
  styleUrls: ['schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
  private calendarApi: any;
  currentStartDate: any;
  currentEndDate: any;

  constructor(private scheduleService: ScheduleService,
    private router: Router) {}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this), // Bind the eventClick callback
  };

  ngOnInit(): void {
    // You can perform additional setup logic here
    // this.getSchedule();
  }

  ngAfterViewInit() {
    this.calendarApi = this.fullcalendar.getApi();
    this.currentStartDate = this.calendarApi.view.currentStart;
    this.currentEndDate = this.calendarApi.view.currentEnd;
    this.getSchedule();
  }

  getSchedule() {
    console.log(this.currentStartDate);
    const startDateFormatted = (this.currentStartDate?.setHours(0, 0, 0, 0) && this.currentStartDate.toISOString()) ||
    new Date().toISOString();
    const endDateFormatted =
      (this.currentEndDate?.setHours(23, 59, 59, 999) && this.currentEndDate.toISOString()) ||
      new Date().toISOString();

    this.scheduleService
      .getScheduleBetweenDates(startDateFormatted, endDateFormatted)
      .pipe(
        tap({
          next: (data: any) => {
            localStorage.setItem('scheduleData', JSON.stringify(data));

            // Clear events if no data
            if (!data || data.length === 0) {
              this.calendarOptions.events = [];
              return;
            }

            // Update events in calendarOptions
            this.calendarOptions.events = data.map((event: any) => this.mapScheduleToEvent(event));
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
      title: schedule.order.description,
      start: schedule.delivery_date,
      // Add other event properties as needed
    };
  }

  handleEventClick(info: any) {
    // 'info' contains information about the clicked event
    console.log('Event clicked:', info);

    const eventDate = info.event.start.toISOString();

    this.router.navigate(['/carte', { date: eventDate }]);
  }
}