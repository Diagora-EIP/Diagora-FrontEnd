import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehiculesService } from 'src/app/services/vehicules.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-add-vehicule',
    templateUrl: './add-vehicule.component.html',
    styleUrls: ['./add-vehicule.component.scss']
})
export class AddVehiculeComponent {
    name: string = ''

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddVehiculeComponent>, private vehiculeService: VehiculesService) { }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.name === '') {
            return false;
        }
        return true;
    }

    addVehicule = async () => {
        if (!this.dataCheck()) { return }
        this.vehiculeService.createVehicule(this.name)
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
