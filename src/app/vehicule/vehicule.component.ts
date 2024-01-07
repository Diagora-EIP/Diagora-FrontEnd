import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { VehiculesService } from '../services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';
import { DeleteVehiculeComponent } from './modals/delete-vehicule/delete-vehicule.component';

import { PermissionsService } from '../services/permissions.service';

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
    allVehicules: any;
    users: any[] = [];
    selectedUser: string = '';
    date: string = new Date().toISOString().split('T')[0];

    constructor(private router: Router, public dialog: MatDialog, private vehiculesService: VehiculesService, private permissionsService: PermissionsService) {
    }

    ngOnInit(): void {
        this.vehiculesService.getCompanyInfo().subscribe((data) => {
            this.users = data.users;
        });
    }

    async getVehicules() {
        // console.log('Date ', this.date);
        // this.vehiculesService.getVehicules().subscribe((data) => {
        //     this.allVehicules = data;
        // });
    }

    goto(params: string) {
        this.router.navigate([params]);
    }

    openModal(type: string = 'DETAILS', info: any = {}): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
            data: {
                id: info.id,
                name: info.name,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', type, 'est fermée.', result);
        });
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }
}
