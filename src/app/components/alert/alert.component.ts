import {
    Component,
    OnChanges,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    SimpleChanges,
} from '@angular/core';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-alert',
    '[style.--app-alert-color]': 'color',
    '[class.app-alert-with-title]': 'title',
  },
})
export class AlertComponent implements OnChanges {
    @Input() type?: AlertType = 'info';
    @Input() title?: string;
    @Input() color?: string;
    @Input() showIcon?: boolean;

    setColorFromType(): void {
        switch (this.type) {
            case 'error':
                this.color = '239, 68, 68';
                break;
            case 'warning':
                this.color = '249, 115, 22';
                break;
            case 'info':
                this.color = '66, 153, 225';
                break;
            case 'success':
                this.color = '34, 197, 94';
                break;
        }
    }

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        const { type } = changes;

        if (type) {
            this.setColorFromType();
        }
    }
}
