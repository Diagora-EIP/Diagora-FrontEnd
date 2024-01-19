import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, tap, throwError } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-user-update-modal',
    templateUrl: './user-update-modal.component.html',
    styleUrls: ['./user-update-modal.component.scss'],
})
export class UserUpdateModalComponent {
    rolesList: any = []
    companies: any = []
    baseName: string = ''
    baseEmail: string = ''
    user: any = null
    baseUser: any = null
    updateUserSubscription: Subscription | undefined;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserUpdateModalComponent>,
        private adminService: AdminService,
        private snackBarService: SnackbarService
    ) {
        this.user = data.user
        this.baseUser = data.user
        this.baseEmail = this.user.email
        this.baseName = this.user.name
        // this.rolesList = data.roles
        // this.companies = data.companyList
    }


    close(): void {
        this.dialogRef.close();
        this.updateUserSubscription?.unsubscribe();
    }

    dataCheck() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(this.user.email)) {
            return false
        }
        if (this.user.name.length == 0) {
            return false
        }
        return true
    }

    updateUser = async () => {
        if (this.dataCheck() == false) {
            return
        }

        if (this.baseEmail == this.user.email && this.baseName == this.user.name) {
            this.dialogRef.close();
            return
        }

        this.updateUserSubscription = this.adminService.updateUser(this.user.id, this.user.email, this.user.name)
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            // this.emailErrorMessage = 'Cet utilisateur existe déjà';
                            return;
                        }
                        // this.emailErrorMessage = 'Une erreur est survenue';
                        this.snackBarService.warningSnackBar(err.error.message);
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.snackBarService.successSnackBar('L\'utilisateur '+ this.user.name + ' mis à jour');
                    this.dialogRef.close({ user: this.user });
                },
            });
    }
}
