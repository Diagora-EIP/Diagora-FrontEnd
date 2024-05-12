import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Subscription, tap, throwError } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { ManagerService } from '../../services/manager.service';

@Component({
    selector: 'app-user-update-modal',
    templateUrl: './user-update-modal.component.html',
    styleUrls: ['./user-update-modal.component.scss'],
})
export class ManagerUserUpdateModalComponent {
    selectedRoles: any[] = [];
    rolesList: any = []
    baseUserRoles: any = []
    baseName: string = ''
    user: any = null
    baseUser: any = null
    updateUserSubscription: Subscription | undefined;
    updateRolesSubscription: Subscription | undefined;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ManagerUserUpdateModalComponent>,
        private managerService: ManagerService,
        private snackBarService: SnackbarService
    ) {
        this.user = data.user
        this.baseUser = data.user
        this.baseName = this.user.name
        this.rolesList = data.rolesList
        this.selectedRoles = this.user.roles.map((role: any) => role.name)
        this.baseUserRoles = this.selectedRoles
    }


    close(): void {
        this.dialogRef.close();
        this.updateUserSubscription?.unsubscribe();
        this.updateRolesSubscription?.unsubscribe();
    }

    dataCheck() {
        if (this.user.name.length == 0) {
            return false
        }
        return true
    }

    getRolesListName = () => {
        return this.rolesList.map((role: any) => role.name)
    }

    updateUserInfos = async () => {
        this.updateUserSubscription = this.managerService.updateUserInformations(this.user.user_id, this.user.name)
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
                    this.snackBarService.successSnackBar('L\'utilisateur ' + this.user.name + ' mis à jour');
                    this.dialogRef.close({ user: this.user });
                },
            });
    }

    updateUser = async () => {
        if (this.dataCheck() == false) {
            return
        }

        if (this.baseName == this.user.name && (this.baseUserRoles === this.selectedRoles || this.selectedRoles.length === 0)) {
            this.dialogRef.close();
            return
        }

        if (this.baseUserRoles === this.selectedRoles || this.selectedRoles.length === 0) {
            this.updateUserInfos()
            return
        }

        this.updateRolesSubscription = this.managerService.updateRoles(this.user.user_id, this.selectedRoles)
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
                    this.user.roles = this.rolesList.filter((role: any) => this.selectedRoles.includes(role.name))
                    this.snackBarService.successSnackBar('L\'es rôles de l\'utilisateur ont été mis à jour');
                    this.updateUserInfos()
                },
            });
    }
}
