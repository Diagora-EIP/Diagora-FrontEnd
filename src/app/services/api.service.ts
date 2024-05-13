import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';

/**
 * @description
 * A service that provides the base URL, options, and HTTP client for API requests.
 *
 * @example
 * ```ts
 * import { ApiService } from './api.service';
 *
 * @Injectable()
 * export class MyService {
 *     constructor(private api: ApiService) {
 *         this.api.http.get(`${this.api.baseUrl}/path`, this.api.options).subscribe();
 *     }
 * }
 * ```
 *
 * @example
 * Using with the `DestroyService` to unsubscribe from observables when the component is destroyed:
 * ```ts
 * import { ApiService } from './api.service';
 * import { DestroyService } from './destroy.service';
 * import { takeUntil } from 'rxjs/operators';
 *
 * @Injectable()
 * export class MyService {
 *     constructor(private api: ApiService, private destroy$: DestroyService) {
 *         this.api.http.get(`${this.api.baseUrl}/path`, this.api.options)
 *             .pipe(takeUntil(this.destroy$))
 *             .subscribe();
 *     }
 * }
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private _token:  string | null = localStorage.getItem('token');
    private _userId: string | null = localStorage.getItem('id');
    private _options: any = {};
    private _baseUrl = environment.apiUrl;

    get userId(): string | null {
        return this._userId;
    }

    get options(): {} | { headers: { Authorization: string; }; } {
        return this._options;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get http(): HttpClient {
        return this.httpClient;
    }

    constructor(
        private httpClient: HttpClient,
    ) {
        if (this._token != null) {
            this._options = {
                headers: {
                    Authorization: 'Bearer ' + this._token,
                },
            };
        }
    }
}
