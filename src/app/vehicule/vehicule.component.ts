import { Component, Type, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';


import { VehiculesService } from '../services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';

import { SnackbarService } from '../services/snackbar.service';
import { SecurityService } from '../services/security.service';
import { PermissionsService } from '../services/permissions.service';
import { VehicleExpenseCreateModalComponent } from './modals/vehicle-expense-create-modal/vehicle-expense-create-modal.component';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsVehiculeComponent,
    ADD: AddVehiculeComponent,
    EDIT: EditVehiculeComponent,
};

@Component({
    selector: 'app-vehicule',
    templateUrl: './vehicule.component.html',
    styleUrls: ['./vehicule.component.scss']
})
export class VehiculeComponent {
    modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
        CREATEEXPENSE: {
            component: VehicleExpenseCreateModalComponent,
            constructor: () => {
                return {
                    vehicle: this.selectedVehicle,
                    isManager: this.isManager,
                }
            },
            action: (instance: any) => { }
        },
        DETAILS: {
            component: DetailsVehiculeComponent,
            constructor: () => {
                return {
                    isManager: this.isManager,
                }
            },
            action: (instance: any) => this.getVehicules()
        },
        ADD: {
            component: AddVehiculeComponent,
            constructor: () => {
                return {
                }
            },
            action: (instance: any) => {
                // setTimeout(() => {
                // console.log("getVehicules")
                this.getVehicules();
                // }, 2000);
            }
        },
        EDIT: {
            component: EditVehiculeComponent,
            constructor: () => {
                return {
                    data: this.selectedVehicle,
                }
            },
            action: (instance: any) => {
                this.getVehicules()
            }
        },
    };
    displayedColumns = ['name', 'brand', 'model', 'license', 'mileage'];
    vehiclesStatus = ['available', 'repair', 'broken'];
    allVehicles: any[] = [];
    users: any[] = [];
    companyName: string = '';
    isManager: boolean = false;
    selectedVehicle: any = null;
    loading: boolean = false;
    allVehiclesLocked: number[] = [];

    constructor(private router: Router,
        public dialog: MatDialog,
        private vehiculesService: VehiculesService,
        private permissionsService: PermissionsService,
        private cdr: ChangeDetectorRef,
        private snackbarService: SnackbarService,
        private confirmModalService: ConfirmModalService,) {
    }

    ngOnInit(): void {
        this.isManager = this.permissionsService.hasPermission('manager')
        this.displayedColumns.push('action');
        this.getCompany();
        this.getVehicules();
        this.getVehiculesLocked();
    }

    getCompany() {
        this.vehiculesService.getCompanyInfo()
            .subscribe((data) => {
                this.companyName = data.name;
            });
    }

    getVehicules() {
        this.loading = true;
        this.vehiculesService.getVehicules()
            .subscribe((data) => {
                this.allVehicles = data;
                this.loading = false;
            });
    }

    getVehiculesLocked() {
        const current_date = new Date();
        const current_date_string = current_date.toISOString().split('T')[0];
        this.vehiculesService.getVehicleLock(current_date_string)
            .subscribe((data) => {
                const vehicleIds = data.map((vehicle_lock: any) => (vehicle_lock).vehicle.vehicle_id);
                this.allVehiclesLocked = vehicleIds;
            });
    }

    openModal(modalType: string): void {
        const { component, constructor, action } = this.modalComponentMapping[modalType.toUpperCase()];

        if (!component) {
            throw new Error(`Type de modal non pris en charge : ${modalType}`);
        }

        const dialogRef = this.dialog.open(component, {
            panelClass: 'custom',
            data: constructor()
        });

        dialogRef.afterClosed().subscribe((data) => {
            this.getVehicules();
            if (!data)
                return
            action(data);
        });
    }

    addVehicle() {
        if (!this.isManager)
            return
        this.openModal('ADD')
    }

    addExpense(vehicle: any) {
        this.selectedVehicle = vehicle
        this.openModal('CREATEEXPENSE')
    }

    editVehicle(vehicle: any) {
        this.selectedVehicle = vehicle
        if (!this.isManager)
            return
        this.openModal('EDIT')
    }

    deleteVehicle(vehicle: any) {
        this.selectedVehicle = vehicle


        if (!this.isManager)
            return
        this.confirmModalService.openConfirmModal('Voulez-vous vraiment supprimer ce véhicule ?').then((result) => {
            if (result) {
                this.vehiculesService.deleteVehicule(vehicle.vehicle_id).pipe().subscribe(() => {
                    this.getVehicules()
                    this.snackbarService.successSnackBar("Le véhicule a bien été supprimé.");
                    this.loading = false;
                });
            }
        });
    }

    setStatus(vehicle_status: string) {
        switch (vehicle_status) {
            case this.vehiclesStatus[0]:
                return 'Disponible'
            case this.vehiclesStatus[1]:
                return 'En maintenance'
            case this.vehiclesStatus[2]:
                return 'Hors service'
            default:
                return 'Inconnu'
        }
    }
}
