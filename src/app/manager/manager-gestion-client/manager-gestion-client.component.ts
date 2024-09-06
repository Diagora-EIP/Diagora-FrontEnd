import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { AddClientComponent } from './modals/add-client/add-client.component';
import { EditClientComponent } from './modals/edit-client/edit-client.component';
import { PermissionsService } from '../../services/permissions.service';
import { ConfirmModalService } from '../../confirm-modal/confirm-modal.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ClientService } from '../../services/client.service';


const modalComponentMapping: { [key: string]: Type<any> } = {
    ADD: AddClientComponent,
    EDIT: EditClientComponent,
};
@Component({
    selector: 'app-manager-gestion-client',
    templateUrl: './manager-gestion-client.component.html',
    styleUrls: ['./manager-gestion-client.component.scss', '../../../variables.scss']
})
export class ManagerGestionClientComponent {
    displayedColumns = ['name', 'email', 'address', 'action'];
    allClients: any[] = [];
    // allClients = [
    //     { name: 'John Smith', mail: 'shadow@gmail.com', },
    //     { name: 'Deliveroo', mail: 'deliveroo@gmail.com', },
    //     { name: 'Uber', mail: 'eats@gmail.com', },
    // ];
    // formatedOrders: any = [];
    clients: any[] = [];

    constructor(private router: Router, 
                public dialog: MatDialog, 
                private permissionsService: PermissionsService,
                private confirmModalService: ConfirmModalService,
                private snackbarService: SnackbarService,
                private clientService: ClientService) { }

    refresh() {
        this.allClients = this.allClients;
    };

    ngOnInit(): void {
        // console.log('Date ', this.date);
        // this.commandsService.getCompanyInfo().subscribe((data) => {
        //     this.users = data.users;
        // });
        this.getClients();
    }

    getClients() {
        this.clientService.getAllClientsByCompany().subscribe(
            (data) => {
                this.allClients = [];
                this.allClients = data;
            }
        )
    }

    goto(params: string) {
        this.router.navigate([params]);
    }

    openModal(type: string = '', info: any = {}): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        console.log('type', type);
        console.log('info', info);
        

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
            data: info
        });

        dialogRef.afterClosed().subscribe((result) => {
            // TEMP PART BEFORE LINK WITH BACKEND
            if (type === 'ADD') {
                if (!result) {
                    return;
                }
                if (result === 'error') {
                    this.snackbarService.warningSnackBar("Un problème est survenu lors de l'ajout du client.");
                    return;
                }

                this.getClients();
                this.snackbarService.successSnackBar("Le client a bien été ajouté.");
            }
            // TEMP PART BEFORE LINK WITH BACKEND
            if (type === 'EDIT') {
                if (!result) {
                    return;
                }
                if (result === 'error') {
                    this.snackbarService.warningSnackBar("Un problème est survenu lors de la modification du client.");
                    return;
                }

                console.log('result', result);
                this.getClients();
                console.log('allClients', this.allClients);
                this.snackbarService.successSnackBar("Le client a bien été modifié.");
            }
            console.log('La modal', type, 'est fermée.', result);
        });
    }

    deleteClient(info: any): void {
        this.confirmModalService.openConfirmModal('Voulez-vous vraiment supprimer ce client ?').then((result) => {
            if (result) {
                this.clientService.deleteClient(info.client_id).subscribe(
                    (data) => {
                        console.log('Client deleted', data);
                        this.getClients();
                    },
                    (error) => {
                        console.log('Error deleting client', error);
                    }
                )
                this.snackbarService.successSnackBar("Le client a bien été supprimé.");
            }
        });
    }

    checkIsUnique(name: string, mail: string): boolean {
        let count = 0;
        let allClients = this.allClients;
        allClients.forEach((client) => {
            if (client.name === name && client.mail === mail) {
                count += 1;
            }
        });
        // console.log('CHECK IS UNIQUE:');
        // console.log('count', count);
        // console.log('name', name, 'mail', mail);
        // console.log('allClients', this.allClients);
        // console.log('---------------------------------------------');

        return count <= 1;
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }
}
