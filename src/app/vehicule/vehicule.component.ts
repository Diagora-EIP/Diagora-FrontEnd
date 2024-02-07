import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { VehiculesService } from '../services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';
import { DeleteVehiculeComponent } from './modals/delete-vehicule/delete-vehicule.component';

import { SnackbarService } from '../services/snackbar.service';

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
    displayedColumns = ['name', 'brand', 'model', 'license', 'mileage', 'action'];
    allVehicles: any[] = [];
    users: any[] = [];
    companyName: string = '';

    constructor(private router: Router,
        public dialog: MatDialog,
        private vehiculesService: VehiculesService,
    ) {
    }

    ngOnInit(): void {
        this.getCompany();
        this.getVehicules();
    }

    async getCompany() {
        this.vehiculesService.getCompanyInfo().subscribe((data) => {
            this.companyName = data.name;
        });
    }

    async getVehicules() {
        this.vehiculesService.getVehicules().subscribe((data) => {
            this.allVehicles = data;
        });
    }

    openModal(type: string = 'DETAILS', info: any = {}): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
            data: info
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', type, 'est fermée.', result);
            this.getVehicules();
        });

    }
}
