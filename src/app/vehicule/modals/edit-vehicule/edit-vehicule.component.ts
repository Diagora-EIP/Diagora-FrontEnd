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

    constructor(@Inject(MAT_DIALOG_DATA) 
                public data: any, 
                public dialogRef: MatDialogRef<EditVehiculeComponent>, 
                private vehiculeService: VehiculesService,
                private snackBarService: SnackbarService) { }

    close(): void {
        this.dialogRef.close();
    }

    formatData() {
        if (this.name === '') {
            return false;
        }
        return true;
    }

    editVehicule = async () => {
        if (this.formatData()) {
            this.dialogRef.close();
        }
        this.vehiculeService.updateVehicule(this.data.vehicle_id, this.name)
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
