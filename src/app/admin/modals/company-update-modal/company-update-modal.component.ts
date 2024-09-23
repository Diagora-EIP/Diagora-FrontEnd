import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, throwError } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-company-update-modal',
    templateUrl: './company-update-modal.component.html',
    styleUrls: ['./company-update-modal.component.scss'],
})
export class CompanyUpdateModalComponent {
    errorMessage: string = '';
    original_company_name: string = ''
    original_company_address: string = ''
    company_name: string = ''
    number: string = ''
    rue: string = ''
    ville: string = ''
    codePostal: string = ''
    company_id: number = 0
    updateCompanySubscription: Subscription | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CompanyUpdateModalComponent>,
        private adminService: AdminService,
        private snackBarService: SnackbarService
    ) {
        this.original_company_name = data.company.company_name
        this.company_name = data.company.company_name
        this.company_id = data.company.company_id
        this.original_company_address = data.company.company_address
        console.log(data.company.company_address)
        const address = data.company.company_address.split(', ')
        this.number = address[0].split(' ')[0]
        this.rue = address[0].split(' ').slice(1).join(' ')
        this.codePostal = address[1].split(' ')[0]
        this.ville = address[1].split(' ').slice(1).join(' ')
    }


    close(): void {
        this.dialogRef.close();
        this.updateCompanySubscription?.unsubscribe();
    }

    dataCheck() {
        const address = `${this.number} ${this.rue}, ${this.codePostal}, ${this.ville}`;
        if (this.company_name.length == 0)
            return false
        if (address.length == 0)
            return false
        return true
    }

    updateCompany = async () => {
        if (this.dataCheck() == false) {
            return
        }
        const address = `${this.number} ${this.rue}, ${this.codePostal}, ${this.ville}`;

        if (this.company_name == this.original_company_name && address == this.original_company_address) {
            this.dialogRef.close();
            return
        }
        this.updateCompanySubscription = this.adminService.updateCompany(this.company_name.trim(), this.company_id, address.trim())
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 202) {
                            this.dialogRef.close({ company_name: this.company_name });
                            return;
                        }

                        if (err.status === 409) {
                            this.errorMessage = 'Cette entreprise existe déjà';
                            this.snackBarService.warningSnackBar('Cette entreprise existe déjà');
                            return;
                        }
                        this.snackBarService.warningSnackBar('Une erreur est survenue');
                        this.errorMessage = 'Une erreur est survenue';
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.snackBarService.successSnackBar('Entreprise modifiée');
                    this.dialogRef.close(data);
                }
            });
    }
}
