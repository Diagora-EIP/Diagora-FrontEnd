import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { AddClientComponent } from './modals/add-client/add-client.component';
import { EditClientComponent } from './modals/edit-client/edit-client.component';
import { DeleteClientComponent } from './modals/delete-client/delete-client.component';
import { PermissionsService } from '../../services/permissions.service';

const modalComponentMapping: { [key: string]: Type<any> } = {
    ADD: AddClientComponent,
    EDIT: EditClientComponent,
    DELETE: DeleteClientComponent,
};
@Component({
    selector: 'app-manager-gestion-client',
    templateUrl: './manager-gestion-client.component.html',
    styleUrls: ['./manager-gestion-client.component.scss', '../../../variables.scss']
})
export class ManagerGestionClientComponent {
    displayedColumns = ['name', 'mail', 'action'];
    // allClients: any[] = [];
    allClients = [
        { name: 'John Smith', mail: 'shadow@gmail.com', },
        { name: 'Deliveroo', mail: 'deliveroo@gmail.com', },
        { name: 'Uber', mail: 'eats@gmail.com', },
    ];
    // formatedOrders: any = [];
    clients: any[] = [];

    constructor(private router: Router, public dialog: MatDialog, private permissionsService: PermissionsService) { }

    refresh() {
        this.allClients = this.allClients;
    };

    ngOnInit(): void {
        // console.log('Date ', this.date);
        // this.commandsService.getCompanyInfo().subscribe((data) => {
        //     this.users = data.users;
        // });
    }

    async getClients() {
        // if (this.selectedUser === '') {
        //     return;
        // }

        // this.selectedUserName = this.selectedUser.name;

        // this.commandsService.getSchedules(this.date, this.selectedUser.user_id).subscribe((data) => {
        //     this.allOrders = data;
        //     if (this.allOrders.length === 0) {
        //         this.formatedOrders = [];
        //         return;
        //     }
        //     this.allOrders.forEach((order) => {
        //         let tmp: any = {};
        //         let tempDate = new Date(order.delivery_date);
        //         const formattedDate = `${tempDate.toLocaleDateString('en-GB')} ${tempDate.toLocaleTimeString('en-GB', { hour12: false })}`;
        //         tmp['delivery_date'] = formattedDate;
        //         tmp['delivery_address'] = order.order.delivery_address;
        //         tmp['description'] = order.order.description;
        //         tmp['schedule_id'] = order.schedule_id;
        //         this.formatedOrders.push(tmp);
        //     });
        // });
    }

    goto(params: string) {
        this.router.navigate([params]);
    }

    openModal(type: string = '', info: any = {}): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
            data: info
        });

        dialogRef.afterClosed().subscribe((result) => {
            // TEMP PART BEFORE LINK WITH BACKEND
            if (type === 'ADD') {
                this.allClients.push({ name: result.name, mail: result.mail });
            }
            // TEMP PART BEFORE LINK WITH BACKEND
            if (type === 'EDIT') {
                this.allClients.forEach((client, index) => {
                    if (client.name === info.name && client.mail === info.mail) {
                        this.allClients[index] = result;
                    }
                });
            }
            // TEMP PART BEFORE LINK WITH BACKEND
            if (type === 'DELETE' && result === true) {
                this.allClients.forEach((client, index) => {
                    if (client.name === info.name && client.mail === info.mail) {
                        this.allClients.splice(index, 1);
                    }
                });
            }

            console.log('La modal', type, 'est fermée.', result);
        });
        console.log('allClients', this.allClients);
    }

    checkIsUnique(name: string, mail: string): boolean {
        let count = 0;
        this.allClients.forEach((client) => {
            if (client.name === name && client.mail === mail) {
                count += 1;
            }
        });
        console.log('CHECK IS UNIQUE:');
        console.log('count', count);
        console.log('name', name, 'mail', mail);
        console.log('allClients', this.allClients);
        console.log('---------------------------------------------');

        return count <= 1;
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }
}
