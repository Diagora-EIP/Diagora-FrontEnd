import {
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    Inject,
} from "@angular/core";

import { WebsocketService } from "./websocket.service";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WebSocketClientPacket, WebSocketServerPacket, WebSocketServerPacketResponse } from "./websocket.service.types";
import { Subject, takeUntil } from "rxjs";

interface DialogData {
    sent: string;
    received: string;
}

/**
 * This component is used to debug the websocket service.
 */
@Component({
    selector: 'app-websocket',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './websocket.component.html',
    styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    received: string = '';
    sent: string = '';

    constructor(
        private readonly dialog: MatDialog,
        private readonly websocketService: WebsocketService,
    ) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(WebsocketDialogComponent, {
            minWidth: '80vw',
            maxWidth: '80vw',
            data: {
                received: this.received,
                sent: this.sent,
            },
        });
    }

    ngOnInit(): void {
        this.websocketService.onConnect$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.received) {
                    this.received += '==========\n';
                }
                this.received += 'Connected\n';
            });

        this.websocketService.onAuthentified$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketServerPacket) => {
                this.received += JSON.stringify(value, null, 2) + '\n';
            });

        this.websocketService.onMessageSent$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketClientPacket) => {
                this.sent += JSON.stringify(value, null, 2) + '\n';
            });

        this.websocketService.onMessage$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketServerPacket) => {
                this.received += JSON.stringify(value, null, 2) + '\n';
            });

        this.websocketService.onClose$
            .pipe(takeUntil(this.destroy$))
            .subscribe((reason) => {
                this.received += `Closed: ${reason.reason}\n`;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

type Subscription = {
    namespace: string,
    topic: string,
};

@Component({
    selector: 'app-websocket-dialog',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './websocket.dialog.component.html',
})
export class WebsocketDialogComponent implements OnInit, OnDestroy {
    sent: string = '';
    received: string = '';
    isConnected: boolean = false;
    subscriptions: Subscription[] = [];

    namespace: string = '';
    topic: string = '';
    parameters: any = '';

    private readonly destroy$ = new Subject<void>();

    get userId(): string | null {
        return localStorage.getItem('id');
    }

    connect(): void {
        this.websocketService.connect();
        if (this.sent) {
            this.sent += '==========\n';
        }
        this.sent += 'Connecting...\n';
        this.cdr.detectChanges();
    }

    disconnect(): void {
        if (this.websocketService.isConnected) {
            this.websocketService.disconnect();
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }

    subscribe(): void {
        this.subscriptions.push({
            namespace: this.namespace,
            topic: this.topic,
        });
        this.websocketService.subscribe(this.namespace, this.topic, JSON.parse(this.parameters));
        this.cdr.detectChanges();
    }

    unsubscribe(subscription: Subscription): void {
        this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
        this.websocketService.unsubscribe(subscription.namespace, subscription.topic);
        this.cdr.detectChanges();
    }

    resetSubscriptions(): void {
        this.namespace = 'follow-up';
        this.topic = 'point';
        this.parameters = `{ "user_id": ${this.userId} }`
        this.subscriptions = [];
        this.cdr.detectChanges();
    }

    constructor(
        public readonly dialogRef: MatDialogRef<WebsocketDialogComponent>,
        private readonly websocketService: WebsocketService,
        private readonly cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
        this.sent = data.sent;
        this.received = data.received;
    }

    ngOnInit(): void {
        this.websocketService.onConnect$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.received) {
                    this.received += '==========\n';
                }
                this.received += 'Connected\n';
                this.isConnected = true;
                this.resetSubscriptions();
            });

        this.websocketService.onAuthentified$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketServerPacket) => {
                this.received += JSON.stringify(value, null, 2) + '\n';
                this.cdr.detectChanges();
            });

        this.websocketService.onMessageSent$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketClientPacket) => {
                this.sent += JSON.stringify(value, null, 2) + '\n';
                this.cdr.detectChanges();
            });

        this.websocketService.onMessage$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: WebSocketServerPacket) => {
                this.received += JSON.stringify(value, null, 2) + '\n';
                this.cdr.detectChanges();
            });

        this.websocketService.onClose$
            .pipe(takeUntil(this.destroy$))
            .subscribe((reason) => {
                this.received += `Closed: ${reason.reason}\n`;
                this.isConnected = false;
                this.resetSubscriptions();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.websocketService.isConnected) {
            this.websocketService.disconnect();
        }
    }
}
