import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommandsService } from 'src/app/services/commands.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-add-command',
    templateUrl: './add-command.component.html',
    styleUrls: ['./add-command.component.scss']
})
export class AddCommandComponent {
    description: string = ''
    address: string = ''
    date: any;
    hours:any;
    dateFormated: string = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCommandComponent>, private commandService: CommandsService) { }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.description.length == 0)
            return false
        if (this.address.length == 0)
            return false
        if (this.date.length == 0)
            return false
        return true
    }

    addCommand = async () => {
        if (!this.dataCheck()) { return }
        let dateFormated: string = this.combineDateAndTime(this.date, this.hours);
        this.commandService.createOrder(this.description, dateFormated, this.address)
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

    combineDateAndTime(date: Date, time: string): string {
        const combinedDateTime = new Date(date);
        const timeParts = time.split(':');
        combinedDateTime.setHours(Number(timeParts[0]));
        combinedDateTime.setMinutes(Number(timeParts[1]));
        return combinedDateTime.toISOString();
    }
}
