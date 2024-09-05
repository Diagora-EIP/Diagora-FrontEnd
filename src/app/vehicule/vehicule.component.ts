import { Component, Type, ViewRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

import { tap } from 'rxjs';

import { VehiculesService } from '../services/vehicules.service';
import { AddVehiculeComponent } from './modals/add-vehicule/add-vehicule.component';
import { DetailsVehiculeComponent } from './modals/details-vehicule/details-vehicule.component';
import { EditVehiculeComponent } from './modals/edit-vehicule/edit-vehicule.component';

import { SnackbarService } from '../services/snackbar.service';
import { SecurityService } from '../services/security.service';
import { PermissionsService } from '../services/permissions.service';
import { VehicleExpenseCreateModalComponent } from './modals/vehicle-expense-create-modal/vehicle-expense-create-modal.component';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { LockVehicleModalComponent } from './modals/lock-vehicle/lock-vehicle.component';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsVehiculeComponent,
    ADD: AddVehiculeComponent,
    LOCK: LockVehicleModalComponent,
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
        LOCK: {
            component: LockVehicleModalComponent,
            constructor: () => {
                return {
                    data: this.selectedVehicle,
                }
            },
            action: (instance: any) => {
                this.getVehiculesLocked();
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
    name: string = ''
    brand: string = ''
    model: string = ''
    license: string = ''
    mileage: number = 0
    vehicle_id: number = 0
    showSideBar: boolean = false
    newdisplayedColumns: string[] = ['name', 'date'];
    newdisplayedColumnsExpense: string[] = ['name', 'title', 'price'];
    vehicleLock: any[] = [];
    vehicleExpenses: any[] = [];
    vehicleHasPicture: boolean = false;
    modelsList: string[] = [];
    vehiclePictures: any[] = [];

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
                this.modelsList = Array.from(new Set(data.map((vehicle: any) => vehicle.model)));
                this.getVehiclePictures();

            });
    }

    getVehiculesLocked() {
        const current_date = new Date();
        const current_date_string = current_date.toISOString().split('T')[0];
        this.vehiculesService.getVehicleLock(current_date_string)
            .subscribe((data) => {
                if (!data)
                    return
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

    addExpense() {
        this.openModal('CREATEEXPENSE')
    }

    editVehicle(vehicle: any) {
        this.selectedVehicle = vehicle
        if (!this.isManager)
            return
        this.openModal('EDIT')
    }

    onSelectVehicle(vehicle: any) {
        this.vehicleExpenses = []
        this.vehicleLock = []
        this.selectedVehicle = vehicle
        this.name = vehicle.name
        this.brand = vehicle.brand
        this.model = vehicle.model
        this.license = vehicle.license
        this.mileage = vehicle.mileage
        this.vehicle_id = vehicle.vehicle_id
        this.showSideBar = true
        this.getVehicleLock();
        this.getVehicleExpenses();
    }

    deleteVehicle() {
        if (!this.isManager)
            return
        this.confirmModalService.openConfirmModal('Voulez-vous vraiment supprimer ce véhicule ?').then((result) => {
            if (result) {
                this.snackbarService.successSnackBar("Le véhicule est en train d'être supprimé.");
                this.vehiculesService.deleteVehicule(this.vehicle_id).pipe().subscribe(() => {
                    this.getVehicules()
                    this.snackbarService.successSnackBar("Le véhicule a bien été supprimé.");
                    this.loading = false;
                    this.close();
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

    close() {
        this.showSideBar = false
        this.selectedVehicle = null
        this.name = ''
        this.brand = ''
        this.model = ''
        this.license = ''
        this.mileage = 0
        this.vehicle_id = 0
        this.vehicleExpenses = []
        this.vehicleLock = []
    }

    dataCheck() {
        if (this.name === '')
            return false;
        if (this.mileage < 0)
            return false;
        return true;
    }

    editVehicule = async () => {
        if (!this.dataCheck())
            return
        this.vehiculesService.updateVehicule(this.vehicle_id, this.name, this.brand, this.model, this.license, this.mileage)
            .pipe(
                tap({
                    next: data => {
                        this.snackbarService.successSnackBar('Le véhicule ' + this.name + ' a été modifié avec succès !');
                        this.close();
                    },
                    error: error => {
                        console.log(error);
                        this.snackbarService.warningSnackBar('Erreur lors de la modification du véhicule ' + this.name + ' !');
                    }
                })
            ).subscribe();
    }

    askVehiclePicture() {
        if (!this.model || !this.brand || this.model === '' || this.brand === '') {
            this.snackbarService.warningSnackBar('Vous devez avoir renseigné un model et une marque pour pouvoir demander l\'ajoute d\'une photo');
            return;
        }
        this.vehiculesService.askHelpVehiclePicture(this.model, this.brand)
            .subscribe((data) => {
                if (data)
                    this.snackbarService.successSnackBar('Demande d\'ajout de photo envoyée');
                else
                    this.snackbarService.warningSnackBar('Erreur lors de l\'envoi de la demande');
            });
    }

    lockVehicle() {
        this.openModal('LOCK')
    }

    getVehicleExpenses() {
        this.vehiculesService.getExpenseByVehicleId(this.vehicle_id)
            .subscribe((data) => {
                this.vehicleExpenses = data.slice(0, 3);
            });
    }

    getVehicleLock() {
        this.vehiculesService.getLocksByVehicleId(this.vehicle_id)
            .subscribe((data) => {
                this.vehicleLock = data.slice(0, 3);
            });
    }

    getVehiclePictures() {
        if (this.modelsList.length === 0)
            return;
        this.vehiculesService.getVehiclePictures(this.modelsList)
            .subscribe((data) => {
                this.vehiclePictures = data;
            });
    }

    findPicture(vehicle: any) {
        const defaultImage = '../../assets/interrogation.png';

        if (!this.vehiclePictures || this.vehiclePictures.length === 0)
            return defaultImage;

        const picture = this.vehiclePictures.find((vehiclePicture: any) =>
            vehiclePicture.model.toLowerCase() === vehicle.model.toLowerCase()
        );

        return picture ? `data:image/png;base64,${picture.picture}` : defaultImage;
    }
}
