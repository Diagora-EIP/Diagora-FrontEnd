import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, forkJoin, Subscription, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { VehiculesService } from '../../services/vehicules.service';

@Component({
    selector: 'app-user-vehicle-update-modal',
    templateUrl: './user-vehicle-update-modal.component.html',
    styleUrls: ['./user-vehicle-update-modal.component.scss'],
})
export class ManagerUserVehicleUpdateModalComponent {
    user: any = null
    manager_id: any = null
    updateUserVehicleSubscription: Subscription | undefined;
    getUserVehicleSubscription: Subscription | undefined;
    getVehicleListSubscription: Subscription | undefined;
    vehiclesList: any = []
    userVehicles: any = []
    baseUserVehicles: any = []
    selectedVehicles: any = []

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ManagerUserVehicleUpdateModalComponent>,
        private vehiculesService: VehiculesService,
        private snackBarService: SnackbarService
    ) {
        this.user = data.user
        this.getVehiculesList()
        this.getUserVehicules()
    }


    close(): void {
        this.dialogRef.close();
        this.updateUserVehicleSubscription?.unsubscribe();
        this.getUserVehicleSubscription?.unsubscribe();
        this.getVehicleListSubscription?.unsubscribe();
    }

    getVehiculesList() {
        this.getVehicleListSubscription = this.vehiculesService.getVehicules()
            .subscribe({
                next: (data) => {
                    this.vehiclesList = data;
                },
            });
    }

    getUserVehicules() {
        this.getUserVehicleSubscription = this.vehiculesService.getUserVehicle(this.user.user_id)
            .subscribe({
                next: (data) => {
                    this.userVehicles = data;
                    this.selectedVehicles = this.userVehicles
                },
            });
    }

    compareVehicles(vehicle1: any, vehicle2: any): boolean {
        return vehicle1.vehicle_id === vehicle2.vehicle_id;
    }

    dataCheck() {
        if (this.user.name.length == 0) {
            return false
        }
        return true
    }

    getVehicleInfos = (vehicle: any) => {
        let vehicleInfos = vehicle.name
        if (vehicle.brand)
            vehicleInfos += ' - ' + vehicle.brand

        if (vehicle.model)
            vehicleInfos += ' - ' + vehicle.model

        if (vehicleInfos.length >= 15)
            vehicleInfos = vehicleInfos.substring(0, 15) + '...'
        return vehicleInfos
    }

    updateUserVehicle = async () => {
        if (this.selectedVehicles === this.userVehicles) {
            this.dialogRef.close();
            return
        }

        const vehiclesToAdd = this.selectedVehicles.filter((vehicle: any) => !this.userVehicles.some((userVehicle: any) => userVehicle.vehicle_id === vehicle.vehicle_id));
        const vehiclesToRemove = this.userVehicles.filter((userVehicle: any) => !this.selectedVehicles.some((vehicle: any) => vehicle.vehicle_id === userVehicle.vehicle_id));
        const vehicleToUpdate = [...vehiclesToAdd, ...vehiclesToRemove];

        const updateUserVehicleRequests = vehicleToUpdate.map((vehicle: any) => {
            return this.vehiculesService.updateUserVehicle(this.user.user_id, vehicle.vehicle_id)
                .pipe(
                    catchError(err => {
                        this.snackBarService.warningSnackBar(err.error.message || 'Une erreur est survenue');
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    })
                );
        });

        this.updateUserVehicleSubscription = forkJoin(updateUserVehicleRequests)
            .subscribe({
                next: () => {
                    this.snackBarService.successSnackBar('Les véhicules de l\'utilisateur ont été mis à jour');
                    this.dialogRef.close();
                },
                error: (err) => {
                    this.snackBarService.warningSnackBar('Une erreur est survenue lors de la mise à jour des véhicules de l\'utilisateur');
                }
            });
    }

}
