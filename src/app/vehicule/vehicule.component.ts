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
                this.getVehicules()
                this.snackbarService.successSnackBar("Le véhicule a bien été ajouté.");
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
                this.snackbarService.successSnackBar("Le véhicule a bien été modifié.");
            }
        },
    };
    displayedColumns = ['name', 'brand', 'model', 'license', 'mileage'];
    allVehicles: any[] = [];
    users: any[] = [];
    companyName: string = '';
    isManager: boolean = false;
    selectedVehicle: any = null;
    loading: boolean = false;

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
                this.loading = false;
                this.allVehicles = data;
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
            console.log('result', result, vehicle);
            if (result) {
                this.vehiculesService.deleteVehicule(vehicle.vehicle_id).pipe().subscribe(() => {
                    this.getVehicules()
                    this.snackbarService.successSnackBar("Le véhicule a bien été supprimé.");
                });
            }
        });
    }
}
