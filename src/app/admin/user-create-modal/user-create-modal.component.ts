import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';

@Component({
    selector: 'app-user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['./user-create-modal.component.scss'],
})
export class UserCreateModalComponent {
    rolesList: any = ["Utilisateur", "Administrateur"]
    roles: any = []
    entreprises: any = []
    name: string = ''
    email: string = ''

    constructor(public dialogRef: MatDialogRef<UserCreateModalComponent>, private adminService: AdminService) {
        this.entreprises = this.adminService.getEntreprises().then((response: any) => {
            this.entreprises = response
            this.entreprises.unshift({ id: null, name: 'Aucune' })
        })
    }


    close(): void {
        this.dialogRef.close();
    }

    createUser = async () => {
        if (this.roles.length == 0 || this.name.length == 0 || this.email.length == 0) {
            return
        }
        let roles: any = {
            "admin": false,
            "user": false
        }
        if (this.roles.includes("Administrateur")) {
            roles.admin = true
        }
        if (this.roles.includes("Utilisateur")) {
            roles.user = true
        }
        let data: any = await this.adminService.createUser(this.email, this.name, roles)
            .then((response: any) => {
                data = response
            })
            .catch((error: any) => {
                console.log(error)
            })
        console.log("data", data);
        // this.dialogRef.close();
    }
}
