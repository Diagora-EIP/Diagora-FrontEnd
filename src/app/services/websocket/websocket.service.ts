import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Socket, io } from "socket.io-client";
import { DisconnectDescription } from "socket.io-client/build/esm/socket";
import { environment } from "environment";

import { WebSocketClientPacket, WebSocketClientPacketAction, WebSocketClientPacketAuth, WebSocketClientPacketClose, WebSocketServerPacket } from "./websocket.service.types";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private _socket: Socket | null = null;
    private _isAuthentified: boolean = false;

    public readonly onConnect$ = new Subject<void>();
    public readonly onAuthentified$ = new Subject<WebSocketServerPacket>();
    public readonly onMessageSent$ = new Subject<WebSocketClientPacket>();
    public readonly onMessage$ = new Subject<WebSocketServerPacket>();
    public readonly onClose$ = new Subject<{ reason: Socket.DisconnectReason, description?: DisconnectDescription | undefined }>();
    public readonly onError$ = new Subject<any[]>();

    private get websocketUrl(): string {
        return environment.websocketUrl;
    }

    private get token(): string | null {
        return localStorage.getItem('token');
    }

    public get isConnected(): boolean {
        return this._socket !== null && this._socket.connected;
    }

    public get isAuthentified(): boolean {
        return this.isConnected && this._isAuthentified;
    }

    private sendPacket(packet: WebSocketClientPacket): void {
        if (this._socket === null) {
            throw new Error('WS: No socket available.');
        }

        this.onMessageSent$.next(packet);
        this._socket.emit('packet', JSON.stringify(packet));
    }

    private authentify(): void {
        if (this._socket === null) {
            throw new Error('WS: No socket available.');
        }
        if (this.token === null) {
            throw new Error('WS: No token provided.');
        }

        const packet: WebSocketClientPacketAuth = {
            type: "auth",
            sent_at: new Date().toISOString(),
            token: this.token,
        };

        this.sendPacket(packet);
    }

    constructor() {}

    public connect(): void {
        if (this._socket !== null) {
            console.warn('WS: Already connected.');
            return;
        }
        if (this.token === null) {
            throw new Error('WS: No token provided.');
        }

        this._socket = io(this.websocketUrl);

        this._socket.on('connect', () => {
            this.onConnect$.next();
            this._isAuthentified = false;
            this.authentify();
        });

        this._socket.on("disconnect", (reason: Socket.DisconnectReason, description?: DisconnectDescription | undefined) => {
            this.onClose$.next({ reason, description });
            this._socket = null;
            this._isAuthentified = false;
        });

        this._socket.on('error', (...args: any[]) => {
            this.onError$.next(args);
        });

        this._socket.on('packet', (packet: WebSocketServerPacket) => {
            if (packet.type === 'response' && packet.status === 200 && packet.message === 'Authentified') {
                this.onAuthentified$.next(packet);
                this._isAuthentified = true;
            }
            else {
                this.onMessage$.next(packet);
            }
        });
    }

    public disconnect(): void {
        if (this._socket === null) {
            console.warn('WS: Already disconnected.');
            return;
        }

        const packet: WebSocketClientPacketClose = {
            type: "close",
            sent_at: new Date().toISOString(),
        };

        this.sendPacket(packet);
    }

    public subscribe(namespace: string, topic: string, parameters: any): void {
        if (this._socket === null) {
            throw new Error('WS: No socket available.');
        }

        const packet: WebSocketClientPacketAction = {
            type: 'action',
            sent_at: new Date().toISOString(),
            namespace,
            action_type: 'subscribe',
            topic,
            parameters,
        };

        this.sendPacket(packet);
    }

    public unsubscribe(namespace: string, topic: string): void {
        if (this._socket === null) {
            throw new Error('WS: No socket available.');
        }

        const packet: WebSocketClientPacketAction = {
            type: 'action',
            sent_at: new Date().toISOString(),
            namespace,
            action_type: 'unsubscribe',
            topic,
        };

        this.sendPacket(packet);
    }
}
