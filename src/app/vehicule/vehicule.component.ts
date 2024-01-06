import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { VehiculesService } from 'src/app/services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';
import { DeleteVehiculeComponent } from './modals/delete-vehicule/delete-vehicule.component';

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
    logout1!: boolean;
    allVehicules: any;

    constructor(private router: Router, public dialog: MatDialog, private vehiculesService: VehiculesService) { }

    ngOnInit(): void {
        this.logout1 = false;
        this.getVehicules();
    }

    getVehicules = async () => {
        this.vehiculesService.getVehicules().subscribe((data) => {
            this.allVehicules = data;
        });
    }

    goto(params: string) {
        this.router.navigate([params]);
    }

    logout() {
        this.logout1 = true;
    }

    cancel() {
        this.logout1 = false;
    }

    confirm() {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
    }

    openModal(type: string = 'DETAILS', info: any = {}): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
            data: {
                id: info.vehicle_id,
                name: info.vehicle_name,
                dimentions: info.dimentions,
                capacity: info.capacity
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', type, 'est fermée.', result);
        });
    }
}
