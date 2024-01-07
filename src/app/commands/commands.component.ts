import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommandsService } from 'src/app/services/commands.service';
import { AddCommandComponent } from './modals/add-command/add-command.component';
import { DetailsCommandComponent } from './modals/details-command/details-command.component';
import { EditCommandComponent } from './modals/edit-command/edit-command.component';
import { DeleteCommandComponent } from './modals/delete-command/delete-command.component';

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
    allOrders: any;

    constructor(private router: Router, public dialog: MatDialog, private commandsService: CommandsService) { }

    ngOnInit(): void {
        this.getOrders();
    }

    getOrders = async () => {
        const date = new Date();
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const dateFormated = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day;
        this.commandsService.getOrders(dateFormated).subscribe((data) => {
            this.allOrders = data.data;
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

}
