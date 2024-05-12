import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { CommandsService } from '../services/commands.service';
import { AddCommandComponent } from './modals/add-command/add-command.component';
import { DetailsCommandComponent } from './modals/details-command/details-command.component';
import { EditCommandComponent } from './modals/edit-command/edit-command.component';
import { PermissionsService } from '../services/permissions.service';
import { SnackbarService } from '../services/snackbar.service';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { LockVehicleComponent } from './modals/lock-vehicle-modal/lock-vehicle-modal.component';
import { ManagerService } from '../services/manager.service';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsCommandComponent,
    ADD: AddCommandComponent,
    EDIT: EditCommandComponent,
    LOCK: LockVehicleComponent,
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
    user_id = localStorage.getItem('id');
    users: any[] = [];
    selectedUser: any;
    selectedUserName: string = '';
    date: string = new Date().toISOString().split('T')[0];
    isManager: boolean = false;


    constructor(private router: Router,
        public dialog: MatDialog,
        private commandsService: CommandsService,
        private permissionsService: PermissionsService,
        private managerService: ManagerService,
        private snackbarService: SnackbarService,
        private confirmModalService: ConfirmModalService) { }

    ngOnInit(): void {
        this.isManager = this.permissionsService.hasPermission('manager');
        if (this.isManager) {
            this.managerService.getManagerEntreprise().subscribe((data) => {
                this.users = data.users;
                this.users.forEach((user) => {
                    if (user.user_id == this.user_id) {
                        this.selectedUser = user;
                    }
                });
                this.selectedUserName = this.selectedUser.name;
            });
        } else {
            this.selectedUser = { user_id: this.user_id, name: "Moi" }
        }
    }

    async getOrders() {
        if (this.selectedUser === '') {
            return;
        }

        this.commandsService.getSchedules(this.date).subscribe((data) => {
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
                tmp['schedule_id'] = order.schedule_id;
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
            data: info
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', type, 'est fermée.', result);
            this.getOrders();
        });
    }

    deleteOrder(info: any) {
        this.confirmModalService.openConfirmModal('Voulez-vous vraiment supprimer cette commande ?').then((result) => {
            if (result) {
                this.commandsService.deleteOrder(info.schedule_id).pipe(
                    tap(() => this.snackbarService.successSnackBar('Commande supprimée avec succès'))
                ).subscribe(() => {
                    this.getOrders();
                });
            }
        });
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    lockVehicle() {
        this.openModal('LOCK', { user_id: this.selectedUser.user_id, date: this.date, isManager: this.isManager });
    }
}
