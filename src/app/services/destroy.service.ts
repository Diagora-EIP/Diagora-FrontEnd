import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @description
 * A service that emits a value when the component is destroyed.
 * This is useful for unsubscribing from observables when the component is destroyed.
 *
 * @example
 * ```ts
 * import { DestroyService } from './destroy.service';
 * import { takeUntil } from 'rxjs/operators';
 *
 * @Component({
 *    selector: 'app-my-component',
 *    templateUrl: './my-component.component.html',
 * })
 * export class MyComponent {
 *     constructor(private destroy$: DestroyService) {
 *         someObservable$.pipe(takeUntil(this.destroy$)).subscribe();
 *     }
 * }
 * ```
 */
@Injectable({
    providedIn: 'any',
})
export class DestroyService extends Subject<void> implements OnDestroy {
    ngOnDestroy(): void {
        console.log('DestroyService: ngOnDestroy');
        this.next();
        this.complete();
    }
}
