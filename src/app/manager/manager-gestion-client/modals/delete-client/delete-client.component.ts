import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';

@Component({
    selector: 'app-delete-client',
    templateUrl: './delete-client.component.html',
    styleUrls: ['./delete-client.component.scss']
})
export class DeleteClientComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteClientComponent>) { }

    close(): void {
        this.dialogRef.close(false);
    }

    async deleteVehicule() {
        this.dialogRef.close(true);
        // this.vehiculeService.deleteVehicule(this.data.vehicle_id)
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
