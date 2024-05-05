import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { VehiculesService } from '../../../services/vehicules.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-edit-vehicule',
    templateUrl: './edit-vehicule.component.html',
    styleUrls: ['./edit-vehicule.component.scss']
})
export class EditVehiculeComponent {
    name: string = ''
    brand: string = ''
    model: string = ''
    license: string = ''
    mileage: number = 0

    constructor(@Inject(MAT_DIALOG_DATA)
    public data: any,
        public dialogRef: MatDialogRef<EditVehiculeComponent>,
        private vehiculeService: VehiculesService,
        private snackBarService: SnackbarService) {
        this.name = this.data.data.name;
        this.brand = this.data.data.brand;
        this.model = this.data.data.model;
        this.license = this.data.data.license;
        this.mileage = this.data.data.mileage;
    }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.name === '')
            return false;
        if (this.mileage < 0)
            return false;
        return true;
    }

    editVehicule = async () => {
        if (!this.dataCheck())
            return
        this.vehiculeService.updateVehicule(this.data.vehicle_id, this.name, this.brand, this.model, this.license, this.mileage)
            .pipe(
                tap({
                    next: data => {
                        this.snackBarService.successSnackBar('Le véhicule ' + this.data.name + ' a été modifié avec succès !');
                        this.dialogRef.close();
                    },
                    error: error => {
                        console.log(error);
                        this.snackBarService.warningSnackBar('Erreur lors de la modification du véhicule ' + this.data.name + ' !');
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }
}
