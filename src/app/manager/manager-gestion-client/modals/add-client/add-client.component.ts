import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {
    name: string = ''
    mail: string = ''

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddClientComponent>) { }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.name.length == 0)
            return false
        if (this.mail.length == 0)
            return false
        return true
    }

    addClient = async () => {
        if (!this.dataCheck()) { return }
        console.log('Client added', this.name, this.mail);
        this.dialogRef.close({ name: this.name, mail: this.mail });
        
        // let dateFormated: string = this.combineDateAndTime(this.date, this.hours);
        // this.commandService.createOrder(this.description, dateFormated, this.address)
        //     .pipe(
        //         tap({
        //             next: data => {
        //                 this.dialogRef.close();
        //             },
        //             error: error => {
        //                 console.log(error);
        //                 this.dialogRef.close();
        //             }
        //         })
        //     ).subscribe();
    }

    // combineDateAndTime(date: Date, time: string): string {
    //     const combinedDateTime = new Date(date);
    //     const timeParts = time.split(':');
    //     combinedDateTime.setHours(Number(timeParts[0]));
    //     combinedDateTime.setMinutes(Number(timeParts[1]));
    //     return combinedDateTime.toISOString();
    // }
}
