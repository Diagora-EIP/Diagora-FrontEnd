import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
    let websocketService: WebsocketService;

    beforeEach(() => {
    TestBed.configureTestingModule({});
    websocketService = TestBed.inject(WebsocketService);
    });

    it('should be created', () => {
        expect(websocketService).toBeTruthy();
    });
});
