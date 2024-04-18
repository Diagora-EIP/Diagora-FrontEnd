import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../services/snackbar.service';
import { ManagerService } from '../../services/manager.service';

@Component({
    selector: 'app-user-delete-modal',
    templateUrl: './user-delete-modal.component.html',
    styleUrls: ['./user-delete-modal.component.scss'],
})
export class ManagerUserDeleteModalComponent {
    user: any = null
    deleteUserSubscription: Subscription | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ManagerUserDeleteModalComponent>,
        private managerService: ManagerService,
        private snackBarService: SnackbarService
    ) {
        this.user = data.user
    }

    close(): void {
        this.dialogRef.close();
        this.deleteUserSubscription?.unsubscribe();
    }

    deleteUser = async () => {
        this.deleteUserSubscription = this.managerService.deleteUser(this.user.user_id)
            .subscribe({
                next: (data) => {
                    this.snackBarService.successSnackBar('L\'utilisateur à été supprimé');
                    this.dialogRef.close({ isDeleted: true });
                },
            });
    }
}
