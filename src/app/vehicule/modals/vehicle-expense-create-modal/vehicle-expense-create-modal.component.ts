import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { VehiculesService } from '../../../services/vehicules.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
    selector: 'app-vehicle-expense-create-modal',
    templateUrl: './vehicle-expense-create-modal.component.html',
    styleUrls: ['./vehicle-expense-create-modal.component.scss'],
})
export class VehicleExpenseCreateModalComponent {
    userList: any[] = [];
    createExpenseSubscription: Subscription | undefined;
    getUserListSubscription: Subscription | undefined;
    selectedVehicle: any;
    name: string = ''
    description: string = ''
    price: number = 0
    isManager: boolean = false
    user_id: number = 0
    picture: any = null
    pictureName: string = ''

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<VehicleExpenseCreateModalComponent>,
        private managerService: ManagerService,
        private vehiculesService: VehiculesService,
        private snackBarService: SnackbarService
    ) {
        this.selectedVehicle = data.vehicle
        this.isManager = data.isManager
        if (this.isManager)
            this.getUserList()
    }


    close(): void {
        this.dialogRef.close();
        this.createExpenseSubscription?.unsubscribe();
        this.getUserListSubscription?.unsubscribe();
    }

    getUserList() {
        this.getUserListSubscription = this.managerService.getManagerEntreprise().subscribe({
            next: (data) => {
                this.userList = data.users
            },
            error: (err) => {
                this.snackBarService.warningSnackBar('Une erreur est survenue lors de la récupération des utilisateurs');
            }
        });
    }

    dataCheck() {
        let isError = false
        if (this.name.length == 0) {
            this.snackBarService.warningSnackBar('Le nom ne peut pas être vide');
            isError = true
        }
        if (parseFloat(this.price.toString()) <= 0) {
            this.snackBarService.warningSnackBar('Le prix doit être supérieur à 0');
            isError = true
        }
        if (this.isManager && this.user_id == 0) {
            this.snackBarService.warningSnackBar('L\'utilisateur n\'est pas défini');
            isError = true
        }
        return isError
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.convertToBase64(file)
            .then((result: any) => {
                this.pictureName = file.name;
                this.picture = result;
            })
            .catch((err) => {
                this.snackBarService.warningSnackBar('Une erreur est survenue lors de la récupération de l\'image');
            });
    }

    convertToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    updateUserVehicle = async () => {
        if (this.dataCheck()) {
            return
        }

        this.createExpenseSubscription = this.vehiculesService.createExpense(this.selectedVehicle.vehicle_id, this.name, this.description, parseFloat(this.price.toString()), this.picture, this.user_id)
            .subscribe({
                next: () => {
                    this.snackBarService.successSnackBar('La dépense a été créée');
                    this.dialogRef.close();
                },
                error: (err) => {
                    this.snackBarService.warningSnackBar('Une erreur est survenue lors de la création de la dépense');
                }
            });
    }

}
