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
    dimentions: string = ''
    capacity: number = -1

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddVehiculeComponent>, private vehiculeService: VehiculesService) { }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.name.length == 0)
            return false
        if (this.dimentions.length == 0)
            return false
        if (this.capacity == -1)
            return false
        return true
    }

    addVehicule = async () => {
        if (!this.dataCheck()) { return }
        this.vehiculeService.createVehicule(this.name, this.dimentions, this.capacity)
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
