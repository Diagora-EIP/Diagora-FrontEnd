import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { VehiculesService } from 'src/app/services/vehicules.service';

@Component({
    selector: 'app-delete-vehicule',
    templateUrl: './delete-vehicule.component.html',
    styleUrls: ['./delete-vehicule.component.scss']
})
export class DeleteVehiculeComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteVehiculeComponent>, private vehiculeService: VehiculesService) { }

    close(): void {
        this.dialogRef.close();
    }

    deleteVehicule = async () => {
        this.vehiculeService.deleteVehicule(this.data.vehicle_id)
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
