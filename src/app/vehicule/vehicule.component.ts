import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';


import { VehiculesService } from '../services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';
import { DeleteVehiculeComponent } from './modals/delete-vehicule/delete-vehicule.component';

import { SnackbarService } from '../services/snackbar.service';
import { SecurityService } from '../services/security.service';
import { PermissionsService } from '../services/permissions.service';
import { VehicleExpenseCreateModalComponent } from './modals/vehicle-expense-create-modal/vehicle-expense-create-modal.component';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsVehiculeComponent,
    ADD: AddVehiculeComponent,
    EDIT: EditVehiculeComponent,
    DELETE: DeleteVehiculeComponent,
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
            action: (instance: any) => this.getVehicules()
        },
        EDIT: {
            component: EditVehiculeComponent,
            constructor: () => {
                return {
                    data: this.selectedVehicle,
                }
            },
            action: (instance: any) => this.getVehicules()
        },
        DELETE: {
            component: DeleteVehiculeComponent,
            constructor: () => {
                return {
                    data: this.selectedVehicle,
                }
            },
            action: (instance: any) => this.getVehicules()
        },
    };
    displayedColumns = ['name', 'brand', 'model', 'license', 'mileage'];
    allVehicles: any[] = [];
    users: any[] = [];
    companyName: string = '';
    isManager: boolean = false;
    selectedVehicle: any = null;

    constructor(private router: Router,
        public dialog: MatDialog,
        private vehiculesService: VehiculesService,
        private permissionsService: PermissionsService,
        private cdr: ChangeDetectorRef) {
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
        this.vehiculesService.getVehicules()
            .subscribe((data) => {
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
        this.openModal('DELETE')
    }
}
