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
    date: string = ''
    formatedDescription: string = ''
    formatedAddress: string = ''
    formatedDate: string = ''

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditCommandComponent>, private commandService: CommandsService) { }

    close(): void {
        this.dialogRef.close();
    }

    formatData() {
        if (this.description === '') {
            this.formatedDescription = this.data.description;
        } else {
            this.formatedDescription = this.description;
        }
        if (this.address === '') {
            this.formatedAddress = this.data.delivery_address;
        } else {
            this.formatedAddress = this.address;
        }
        if (this.date === '') {
            this.formatedDate = this.data.order_date;
        } else {
            this.formatedDate = this.date + "T00:00:00.000Z";
        }
    }

    editCommand = async () => {
        this.formatData();
        this.commandService.updateOrder(this.data.id, this.formatedDescription, this.formatedDate, this.formatedAddress, this.data.company_id, this.data.order_status, this.data.schedule_id)
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
