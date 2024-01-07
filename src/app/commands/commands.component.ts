import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { CommandsService } from '../services/commands.service';
import { AddCommandComponent } from './modals/add-command/add-command.component';
import { DetailsCommandComponent } from './modals/details-command/details-command.component';
import { EditCommandComponent } from './modals/edit-command/edit-command.component';
import { DeleteCommandComponent } from './modals/delete-command/delete-command.component';
import { PermissionsService } from '../services/permissions.service';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsCommandComponent,
    ADD: AddCommandComponent,
    EDIT: EditCommandComponent,
    DELETE: DeleteCommandComponent,
};

@Component({
    selector: 'app-commands',
    templateUrl: './commands.component.html',
    styleUrls: ['./commands.component.scss']
})

export class CommandsComponent {
    displayedColumns = ['date', 'address', 'description', 'action'];
    allOrders: any[] = [];
    formatedOrders: any = [];
    users: any[] = [];
    selectedUser: any;
    selectedUserName: string = '';
    date: string = new Date().toISOString().split('T')[0];

    constructor(private router: Router, public dialog: MatDialog, private commandsService: CommandsService, private permissionsService: PermissionsService) { }

    ngOnInit(): void {
        console.log('Date ', this.date);
        this.commandsService.getCompanyInfo().subscribe((data) => {
            this.users = data.users;
        });
    }

    async getOrders() {
        if (this.selectedUser === '') {
            return;
        }

        this.selectedUserName = this.selectedUser.name;

        this.commandsService.getSchedules(this.date, this.selectedUser.user_id).subscribe((data) => {
            this.allOrders = data;
            if (this.allOrders.length === 0) {
                this.formatedOrders = [];
                return;
            }
            this.allOrders.forEach((order) => {
                let tmp: any = {};
                let tempDate = new Date(order.delivery_date);
                const formattedDate = `${tempDate.toLocaleDateString('en-GB')} ${tempDate.toLocaleTimeString('en-GB', { hour12: false })}`;
                tmp['delivery_date'] = formattedDate;
                tmp['delivery_address'] = order.order.delivery_address;
                tmp['description'] = order.order.description;
                this.formatedOrders.push(tmp);
            });
        });
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
                id: info.order_id,
                description: info.description,
                delivery_address: info.delivery_address,
                order_date: info.order_date,
                company_id: info.company_id,
                order_status: info.order_status,
                schedule_id: info.schedule_id,
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
