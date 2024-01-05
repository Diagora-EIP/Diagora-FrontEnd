import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { VehiculesService } from 'src/app/services/vehicules.service';

@Component({
    selector: 'app-edit-vehicule',
    templateUrl: './edit-vehicule.component.html',
    styleUrls: ['./edit-vehicule.component.scss']
})
export class EditVehiculeComponent {
    name: string = ''
    dimentions: string = ''
    capacity: number = -1
    formatedName: string = ''
    formatedDimentions: string = ''
    formatedCapacity: number = -1

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditVehiculeComponent>, private vehiculeService: VehiculesService) { }

    close(): void {
        this.dialogRef.close();
    }

    formatData() {
        if (this.name === '') {
            this.formatedName = this.data.name;
        } else {
            this.formatedName = this.name;
        }
        if (this.dimentions === '') {
            this.formatedDimentions = this.data.dimentions;
        } else {
            this.formatedDimentions = this.dimentions;
        }
        if (this.capacity === -1) {
            this.formatedCapacity = this.data.capacity;
        } else {
            this.formatedCapacity = this.capacity;
        }
    }

    editVehicule = async () => {
        this.formatData();
        this.vehiculeService.updateVehicule(this.data.id, this.formatedName, this.formatedDimentions, this.formatedCapacity)
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
