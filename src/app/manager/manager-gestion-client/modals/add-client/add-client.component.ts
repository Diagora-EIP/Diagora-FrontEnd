import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ClientService } from '../../../../services/client.service';

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
    styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {
    name: string = ''
    company: string = ''
    email: string = ''
    address: string = ''
    displayClientAlreadyExists: boolean = false;
    allClients: any[] = [];
    newClient: any = {};

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddClientComponent>, private clientService: ClientService) {
        this.getClients();
    }

    getClients() {
        this.clientService.getAllClientsByCompany().subscribe(
            (data) => {
                this.allClients = data;
                console.log('allClients', this.allClients);
            }
        )
    }

    close(): void {
        this.dialogRef.close();
    }

    addClient() {
        console.log('Client added', this.name, this.company, this.email, this.address);
        
        if (this.allClients?.find((client: { email: string; }) => client.email === this.email)) {
            this.displayClientAlreadyExists = true
            this.dialogRef.close();
        } else {
            this.newClient = {
                name: this.name,
                surname: this.company,
                email: this.email,
                address: this.address
            }
            this.clientService.createClient(this.newClient).subscribe(
                (data) => {
                    this.displayClientAlreadyExists = false;
                    console.log('Client created', data);
                    this.dialogRef.close(this.newClient);
                },
                (error) => {
                    console.log('Error creating client', error);
                    this.dialogRef.close("error");
                }
            )
        }
        
    }
}
