import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, throwError } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-company-create-modal',
    templateUrl: './company-create-modal.component.html',
    styleUrls: ['./company-create-modal.component.scss'],
})
export class CompanyCreateModalComponent {
    errorMessage: string = '';
    name: string = ''
    loginSubscription: Subscription | undefined;

    constructor(
        public dialogRef: MatDialogRef<CompanyCreateModalComponent>,
        private adminService: AdminService
    ) { }


    close(): void {
        this.dialogRef.close();
        this.loginSubscription?.unsubscribe();
    }

    dataCheck() {
        if (this.name.length == 0)
            return false
        return true
    }

    createCompany = async () => {
        if (this.dataCheck() == false) {
            return
        }
        let roles: any = {
            "admin": false,
            "user": false
        }
        this.loginSubscription = this.adminService.createCompany(this.name)
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            this.errorMessage = 'Cette entreprise existe déjà';
                            return;
                        }
                        this.errorMessage = 'Une erreur est survenue';
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.errorMessage = '';
                    this.dialogRef.close();
                }
            });
    }
}
