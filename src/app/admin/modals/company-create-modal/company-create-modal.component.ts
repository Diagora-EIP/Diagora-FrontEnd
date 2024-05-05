import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, throwError } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-company-create-modal',
    templateUrl: './company-create-modal.component.html',
    styleUrls: ['./company-create-modal.component.scss'],
})
export class CompanyCreateModalComponent {
    nameErrorMessage: string = '';
    addressErrorMessage: string = '';
    name: string = ''
    address: string = ''
    createCompanySubscription: Subscription | undefined;

    constructor(
        public dialogRef: MatDialogRef<CompanyCreateModalComponent>,
        private adminService: AdminService,
        private snackBarService: SnackbarService
    ) { }


    close(): void {
        this.dialogRef.close();
        this.createCompanySubscription?.unsubscribe();
    }

    dataCheck() {
        if (this.name.length == 0) {
            this.nameErrorMessage = 'Le nom ne peux être vide';
            return false
        }
        if (this.address.length == 0) {
            this.addressErrorMessage = 'L\'adresse ne peux être vide';
            return false
        }
        return true
    }


    createCompany = async () => {
        this.resetError();
        if (this.dataCheck() == false) {
            return
        }
        this.createCompanySubscription = this.adminService.createCompany(this.name, this.address)
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            this.nameErrorMessage = 'Cette entreprise existe déjà';
                            return;
                        }
                        this.nameErrorMessage = 'Une erreur est survenue';
                        this.addressErrorMessage = 'Une erreur est survenue';
                        this.snackBarService.warningSnackBar('Une erreur est survenue');
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.snackBarService.successSnackBar('Entreprise créée');
                    this.nameErrorMessage = '';
                    this.addressErrorMessage = '';
                    this.dialogRef.close(data);
                }
            });
    }

    resetError() {
        this.nameErrorMessage = '';
        this.addressErrorMessage = '';
    }
}
