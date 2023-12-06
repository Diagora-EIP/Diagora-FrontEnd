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
    date: string = ''

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
        let dateFormated: string = this.date + "T00:00:00.000Z";
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
}
