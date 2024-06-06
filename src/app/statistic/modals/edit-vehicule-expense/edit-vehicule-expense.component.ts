import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { VehiculesService } from '../../../services/vehicules.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-edit-vehicule-expense',
    templateUrl: './edit-vehicule-expense.component.html',
    styleUrls: ['./edit-vehicule-expense.component.scss']
})
export class EditVehiculeExpenseComponent {
    title: string = ''
    description: string = ''
    amount: number = 0
    vehicle_name: string = ''
    vehicle_expense_id: number = 0
    picture: string = ''

    constructor(@Inject(MAT_DIALOG_DATA)
    public data: any,
        public dialogRef: MatDialogRef<EditVehiculeExpenseComponent>,
        private vehiculeService: VehiculesService,
        private snackBarService: SnackbarService) {
        this.title = this.data.data.title;
        this.description = this.data.data.description;
        this.amount = this.data.data.amount;
        this.vehicle_name = this.data.data.vehicle.name;
        this.vehicle_expense_id = this.data.data.vehicle_expense_id;
        this.picture = this.data.data.picture;
    }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.title === '')
            return false;
        if (this.amount < 0)
            return false;
        return true;
    }

    editVehicule = async () => {
        if (!this.dataCheck())
            return
        this.vehiculeService.updateVehicleExpense(this.vehicle_expense_id, this.title, this.description, this.amount, this.picture)
            .pipe(
                tap({
                    next: data => {
                        this.snackBarService.successSnackBar('La dépense ' + this.data.title + ' a été modifié avec succès !');
                        this.dialogRef.close('updated');
                    },
                    error: error => {
                        console.log(error);
                        this.snackBarService.warningSnackBar('Erreur lors de la modification de la dépense ' + this.data.title + ' !');
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }
}
