import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ApiService } from './api.service';
import { WebsocketService } from './websocket/websocket.service';
import { WebSocketServerPacket } from './websocket/websocket.service.types';
import { DestroyService } from './destroy.service';

export type FollowUpSchedule = {
    follow_up_id: number;
    follow_up_schedule_id: number;
    schedule_id: number;
    completed_at: string
    itinerary_id?: number;
};

export type FollowUpPoint = {
    follow_up_id: number;
    follow_up_point_id: number;
    latitude: string;
    longitude: string;
    registered_at: string;
};

@Injectable()
export class FollowUpService implements OnDestroy {
    private _userId: number = -1;
    private _date: string = '';
    private _subscribedTo: number = 0;

    private _allowEmit: boolean = false;
    private _isFirstSchedulesEmit: boolean = true;
    private _isFirstPointsEmit: boolean = true;

    private _listOfSchedules: FollowUpSchedule[] = [];
    private _listOfPoints: FollowUpPoint[] = [];

    private _schedules$ = new Subject<FollowUpSchedule[]>();
    private _points$ = new Subject<FollowUpPoint[]>();

    get schedules$(): Subject<FollowUpSchedule[]> {
        return this._schedules$;
    }

    get points$(): Subject<FollowUpPoint[]> {
        return this._points$;
    }

    get onError$(): Subject<any[]> {
        return this.ws.onError$;
    }

    private mergeSchedules(newSchedules: FollowUpSchedule[]): void {
        const oldLength = this._listOfSchedules.length;
        this._listOfSchedules = this._listOfSchedules.concat(newSchedules);

        if (this._allowEmit && this._isFirstSchedulesEmit) {
            this._schedules$.next(this._listOfSchedules);
            this._isFirstSchedulesEmit = false;
            return;
        }
        if (this._allowEmit && !this._isFirstSchedulesEmit && oldLength !== this._listOfSchedules.length) {
            this._schedules$.next(this._listOfSchedules);
        }
    }

    private mergePoints(newPoints: FollowUpPoint[]): void {
        const oldLength = this._listOfPoints.length;
        this._listOfPoints = this._listOfPoints.concat(newPoints);

        if (this._allowEmit && this._isFirstPointsEmit) {
            this._points$.next(this._listOfPoints);
            this._isFirstPointsEmit = false;
            return;
        }
        if (this._allowEmit && !this._isFirstPointsEmit && oldLength !== this._listOfPoints.length) {
            this._points$.next(this._listOfPoints);
        }
    }

    constructor(
        private api: ApiService,
        private ws: WebsocketService,
        private destroy$: DestroyService,
    ) { }

    public init(userId: number, date: string): void {
        this._userId = userId;
        this._date = date;
        if (this.ws.isConnected) {
            this._subscribedTo = 0;
            this._isFirstSchedulesEmit = true;
            this._isFirstPointsEmit = true;
            this._listOfSchedules = [];
            this._listOfPoints = [];
            this._allowEmit = false;
            this.ws.disconnect(true);
            this.ws.connect();
            return;
        }

        this.ws.onAuthentified$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ws.subscribe('follow-up', 'schedule', { 'user_id': this._userId });
                this.ws.subscribe('follow-up', 'point', { 'user_id': this._userId });
            });

        this.ws.onMessage$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketServerPacket) => {
                switch (value.type) {
                    case 'event':
                        switch (value.from_topic) {
                            case 'schedule':
                                this.mergeSchedules([value.data]);
                                break;
                            case 'point':
                                this.mergePoints([value.data]);
                                break;
                        }
                        break;
                    case 'response':
                        if (
                            value.status === 200 && value.message === 'Subscribed' ||
                            value.status === 400 && value.message === 'Already subscribed'
                        ) {
                            const nbToSubscribe = 2;
                            this._subscribedTo++;
                            if (this._subscribedTo === nbToSubscribe) {
                                this.api.http.get<any>(`${this.api.baseUrl}/follow-up/summary?user_id=${this._userId}&date=${this._date}`, this.api.options)
                                    .pipe(takeUntil(this.destroy$))
                                    .subscribe((response: any) => {
                                        this._allowEmit = true;
                                        this.mergeSchedules(response.schedules);
                                        this.mergePoints(response.points);
                                    });
                            }
                        }
                        break;
                }
            });

        this.ws.connect();
    }

    ngOnDestroy(): void {
        this.ws.disconnect();
        this._schedules$.complete();
        this._points$.complete();
    }
}