import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

type DialogData = {
    start: string;
    end: string;
    user: {
        user_id: number;
        company_id: number;
        email: string;
        name: string;
    };
};

@Component({
    selector: 'app-visualize-schedule-day',
    templateUrl: 'visualize-schedule-day.component.html',
    styleUrls: ['visualize-schedule-day.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizeScheduleDayComponent {
    public date: Date;

    closeDialog() {
        this.dialogRef.close();
    }

    constructor(
        public dialogRef: MatDialogRef<VisualizeScheduleDayComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
        const day = this.data.start.split('-')[2];
        const month = this.data.start.split('-')[1];
        const year = this.data.start.split('-')[0];

        this.date = new Date(Number(year), Number(month) - 1, Number(day));
    }
}
