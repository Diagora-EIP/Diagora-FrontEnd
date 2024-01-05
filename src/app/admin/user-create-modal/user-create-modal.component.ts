import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, tap, throwError } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
    selector: 'app-user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['./user-create-modal.component.scss'],
})
export class UserCreateModalComponent {
    rolesList: any = []
    roles: any = []
    companies: any = []
    selectedCompany: any = null
    name: string = ''
    email: string = ''
    createUserSubscription: Subscription | undefined;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserCreateModalComponent>,
        private adminService: AdminService
    ) {
        this.companies = data.companyList
        this.rolesList = data.roles
    }


    close(): void {
        this.dialogRef.close();
        this.createUserSubscription?.unsubscribe();
    }

    dataCheck() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.email)) {
            console.log("email invalide")
            return false
        }
        if (this.name.length == 0) {
            console.log("name invalide")
            return false
        }
        if (this.roles.length == 0) {
            console.log("roles invalide")
            return false
        }
        return true
    }

    createUser = async () => {
        if (this.dataCheck() == false) {
            return
        }
        console.log("email : ", this.email)
        console.log("name : ", this.name)
        const selectedRolesName = this.roles.map((role: any) => role.name);
        const selectedRolesId = this.roles.map((role: any) => role.role_id);
        console.log("roles : ", selectedRolesName)
        console.log("company_id : ", this.selectedCompany.company_id)

        this.createUserSubscription = this.adminService.createUser(this.email, this.name, selectedRolesName, this.selectedCompany.company_id)
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            // this.emailErrorMessage = 'Cet utilisateur existe déjà';
                            return;
                        }
                        // this.emailErrorMessage = 'Une erreur est survenue';
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    console.log("data : ", data)
                    this.dialogRef.close({ id: 10000, email: this.email, name: this.name, roles: selectedRolesId, company_id: this.selectedCompany.company_id });
                },
            });
    }
}
