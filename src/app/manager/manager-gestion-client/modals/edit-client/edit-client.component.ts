import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {
    name: string = ''
    mail: string = ''

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditClientComponent>) {
        this.name = data.name;
        this.mail = data.mail;
    }

    close(): void {
        this.dialogRef.close(false);
    }

    checkData() {
        if (this.name !== this.data.name || this.mail !== this.data.mail)
            return true;
        return false;
    }

    async editVehicule() {
        if (!this.checkData()) {
            this.dialogRef.close();
        }
        this.dialogRef.close({ name: this.name, mail: this.mail});
        // this.vehiculeService.updateVehicule(this.data.vehicle_id, this.name)
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
}
