import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { VehiculesService } from '../../../services/vehicules.service';
import { PermissionsService } from '../../../services/permissions.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
    selector: 'app-user-vehicle-update-modal',
    templateUrl: './lock-vehicle.component.html',
    styleUrls: ['./lock-vehicle.component.scss'],
})
export class LockVehicleModalComponent {
    date: any = null;
    isManager: boolean = false
    user_id: any = null
    vehicle_name = ''
    updateLockVehicleSubscription: Subscription | undefined;
    selectedVehicles: any
    picker: any
    userList: any[] = [];
    selectedUser: any;
    formattedDate: string | null = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<LockVehicleModalComponent>,
        private vehiculesService: VehiculesService,
        private snackBarService: SnackbarService,
        private permissionsService: PermissionsService,
        private managerService: ManagerService,
    ) {
        this.selectedVehicles = data.data
        this.vehicle_name = data.data.name
        this.user_id = localStorage.getItem('id')
        this.isManager = this.permissionsService.hasPermission('manager');
        if (this.isManager) {
            this.vehiculesService.getUserVehicleByVehicleId(data.data.vehicle_id).subscribe((data) => {
                if (!data) {
                    this.snackBarService.warningSnackBar('Assignez un utilisateur au véhicule');
                    this.dialogRef.close();
                }
                this.userList = data.map((userVehicle: any) => {
                    return { user_id: userVehicle.user.user_id, name: userVehicle.user.name, email: userVehicle.user.email }
                });
            });
        } else {
            this.selectedUser = { user_id: this.user_id, name: "Moi" }
        }
    }


    close(): void {
        this.dialogRef.close();
        this.updateLockVehicleSubscription?.unsubscribe();
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
        if (!this.date) {
            this.dialogRef.close();
            return
        }

        this.date.setHours(this.date.getHours() + 5)
        const date = this.date.toISOString().split('T')[0]

        this.updateLockVehicleSubscription = this.vehiculesService.lockVehicle(this.selectedVehicles.vehicle_id, date, this.isManager ? this.selectedUser.user_id : null)
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

    selectUser(user: any) {
        this.selectedUser = user;
        this.user_id = user.user_id;
    }
}
