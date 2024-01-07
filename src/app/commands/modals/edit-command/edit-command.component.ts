import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { CommandsService } from 'src/app/services/commands.service';

@Component({
    selector: 'app-edit-command',
    templateUrl: './edit-command.component.html',
    styleUrls: ['./edit-command.component.scss']
})
export class EditCommandComponent {
    description: string = ''
    address: string = ''
    date: any;
    hours: string = ''
    formatedDate: string = ''

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditCommandComponent>, private commandService: CommandsService) { }

    close(): void {
        this.dialogRef.close();
    }

    combineDateAndTime(date: Date, time: string): string {
        const combinedDateTime = new Date(date);
        const timeParts = time.split(':');
        combinedDateTime.setHours(Number(timeParts[0]));
        combinedDateTime.setMinutes(Number(timeParts[1]));
        return combinedDateTime.toISOString();
    }

    editCommand = async () => {
        this.formatedDate = this.combineDateAndTime(this.date, this.hours);
        this.commandService.updateOrder(this.data.schedule_id, this.formatedDate)
            .pipe(
                tap({
                    next: data => {
                        this.dialogRef.close();
                    },
                    error: error => {
                        console.log(error);
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }

}
