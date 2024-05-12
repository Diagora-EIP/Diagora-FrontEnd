import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, forkJoin, of, Subscription, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { VehiculesService } from '../../../services/vehicules.service';

@Component({
    selector: 'app-user-vehicle-update-modal',
    templateUrl: './lock-vehicle-modal.component.html',
    styleUrls: ['./lock-vehicle-modal.component.scss'],
})
export class LockVehicleComponent {
    user_id: any = null
    date: any = null
    isManager: boolean = false
    updateLockVehicleSubscription: Subscription | undefined;
    getUserVehicleSubscription: Subscription | undefined;
    selectedVehicles: any = 'Aucun véhicule'
    baseLockVehicle: any = 'Aucun véhicule'
    userVehicles: any = ['Aucun véhicule']

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<LockVehicleComponent>,
        private vehiculesService: VehiculesService,
        private snackBarService: SnackbarService
    ) {
        this.user_id = data.user_id
        this.date = data.date
        this.isManager = data.isManager
        if (this.isManager) {
            this.getUserVehiculesManager()
            this.getVehicleLockManager()
        } else {
            this.getUserVehicules()
            this.getVehicleLock()
        }

    }


    close(): void {
        this.dialogRef.close();
        this.updateLockVehicleSubscription?.unsubscribe();
        this.getUserVehicleSubscription?.unsubscribe();
    }

    getUserVehicules() {
        this.getUserVehicleSubscription = this.vehiculesService.getVehicules()
            .subscribe({
                next: (data) => {
                    this.userVehicles = [...this.userVehicles, ...data];
                },
            });
    }

    getUserVehiculesManager() {
        this.getUserVehicleSubscription = this.vehiculesService.getUserVehicle(this.user_id)
            .subscribe({
                next: (data) => {
                    this.userVehicles = [...this.userVehicles, ...data];
                },
            });
    }

    getVehicleLock() {
        this.vehiculesService.getVehicleLock(this.date)
            .subscribe({
                next: (data) => {
                    if (!data)
                        return
                    this.selectedVehicles = data.vehicle
                    this.baseLockVehicle = data
                },
            });
    }

    getVehicleLockManager() {
        this.vehiculesService.getVehicleLock(this.date, this.user_id)
            .subscribe({
                next: (data) => {
                    if (!data)
                        return
                    this.selectedVehicles = data.vehicle
                    this.baseLockVehicle = data
                },
            });
    }

    compareVehicles(vehicle1: any, vehicle2: any): boolean {
        return vehicle1.vehicle_id === vehicle2.vehicle_id;
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

    updateLockVehicle = async () => {
        if (this.selectedVehicles === this.baseLockVehicle.vehicle) {
            this.dialogRef.close();
            return
        }

        if (this.baseLockVehicle !== 'Aucun véhicule' && this.selectedVehicles !== this.baseLockVehicle.vehicle) {
            this.deleteLockVehicle()
        }

        if (this.selectedVehicles === 'Aucun véhicule') {
            return
        }

        this.updateLockVehicleSubscription = this.vehiculesService.lockVehicle(this.selectedVehicles.vehicle_id, this.date, this.isManager ? this.user_id : null)
            .subscribe({
                next: () => {
                    this.snackBarService.successSnackBar('Véhicule verrouillé avec succès');
                    this.dialogRef.close();
                },
                error: (error) => {
                    if (error.status === 409) {
                        this.snackBarService.warningSnackBar('Le véhicule est déjà verrouillé pour cette date');
                    } else {
                        this.snackBarService.warningSnackBar('Erreur lors du verrouillage du véhicule');
                    }
                }
            });
    }

    deleteLockVehicle = async () => {
        this.updateLockVehicleSubscription = this.vehiculesService.unlockVehicle(this.baseLockVehicle.vehicle_lock_id)
            .subscribe({
                next: () => {
                    this.snackBarService.successSnackBar('Véhicule déverrouillé avec succès');
                    this.dialogRef.close();
                },
                error: (error) => {
                    this.snackBarService.warningSnackBar('Erreur lors du déverrouillage du véhicule');
                }
            });
    }

}
