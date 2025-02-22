import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehiculesService } from '../../../services/vehicules.service';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-add-vehicule',
    templateUrl: './add-vehicule.component.html',
    styleUrls: ['./add-vehicule.component.scss']
})
export class AddVehiculeComponent {
    name: string = ''
    brand: string = ''
    model: string = ''
    license: string = ''
    mileage: number = 0

    constructor(@Inject(MAT_DIALOG_DATA)
    public data: any,
        public dialogRef: MatDialogRef<AddVehiculeComponent>,
        private vehiculeService: VehiculesService,
        private snackBarService: SnackbarService) { }

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

    addVehicule = async () => {
        if (!this.dataCheck())
            return
        this.vehiculeService.createVehicule(this.name, this.brand, this.model, this.license, this.mileage)
            .pipe(
                tap({
                    next: data => {
                        this.snackBarService.successSnackBar('Le véhicule ' + this.name + ' a été ajouté avec succès !');
                        this.dialogRef.close('added');
                    },
                    error: error => {
                        console.log(error);
                        this.snackBarService.warningSnackBar('Erreur lors de l\'ajout du véhicule ' + this.name + ' !');
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }
}
