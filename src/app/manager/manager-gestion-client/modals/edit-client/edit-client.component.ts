import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ClientService } from '../../../../services/client.service';

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {
    name: string = ''
    company: string = ''
    email: string = ''
    address: string = ''
    client_id: number = 0;
    newClient: any = {};

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditClientComponent>, private clientService: ClientService) {
        this.name = data.name;
        this.email = data.email;
        this.company = data.surname;
        this.address = data.address;
        this.client_id = data.client_id;
    }

    close(): void {
        this.dialogRef.close(false);
    }

    checkData() {
        if (this.name !== this.data.name || this.email !== this.data.email || this.company !== this.data.surname || this.address !== this.data.address)
            return true;
        return false;
    }

    async editVehicule() {
        if (!this.checkData()) {
            this.dialogRef.close();
        } else {
            console.log('Edit client', this.name, this.company, this.email, this.address);
            this.newClient = {
                name: this.name,
                surname: this.company,
                email: this.email,
                address: this.address
            }
            this.clientService.updateClient(this.newClient, this.client_id).subscribe(
                (data) => {
                    console.log('Client updated', data);
                    this.dialogRef.close(this.newClient);
                },
                (error) => {
                    console.log('Error updating client', error);
                    this.dialogRef.close("error");
                }
            )
        }
    }
}
