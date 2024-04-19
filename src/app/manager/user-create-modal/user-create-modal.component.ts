import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { ManagerService } from '../../services/manager.service';

@Component({
    selector: 'app-user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['./user-create-modal.component.scss'],
})
export class ManagerUserCreateModalComponent {
    rolesList: any = []
    roles: any = []
    name: string = ''
    email: string = ''
    createUserSubscription: Subscription | undefined;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ManagerUserCreateModalComponent>,
        private managerService: ManagerService,
        private snackBarService: SnackbarService
    ) {
        this.rolesList = data.roles
    }

    close(): void {
        this.dialogRef.close();
        this.createUserSubscription?.unsubscribe();
    }

    dataCheck() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.email)) {
            return false
        }
        if (this.name.length == 0) {
            return false
        }
        if (this.roles.length == 0) {
            return false
        }
        return true
    }

    createUser = async () => {
        if (this.dataCheck() == false) {
            return
        }
        const selectedRolesName = this.roles.map((role: any) => role.name);
        const selectedRolesId = this.roles.map((role: any) => role.role_id);

        this.createUserSubscription = this.managerService.newUserByManager(this.email, this.name, selectedRolesName)
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            // this.emailErrorMessage = 'Cet utilisateur existe déjà';
                            return;
                        }
                        this.snackBarService.warningSnackBar(err.error.message);
                        // this.emailErrorMessage = 'Une erreur est survenue';
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    console.log(data);
                    this.snackBarService.successSnackBar('L\'utilisateur a été créé avec succès');
                    this.dialogRef.close({ id: data.user_id, email: this.email, name: this.name, roles: selectedRolesId });
                },
            });
    }
}
