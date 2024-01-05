import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, throwError } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { tap } from 'rxjs/operators';

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
    company_address: string = ''
    company_id: number = 0
    updateCompanySubscription: Subscription | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CompanyUpdateModalComponent>,
        private adminService: AdminService,
    ) {
        this.original_company_name = data.company.company_name
        this.company_name = data.company.company_name
        this.company_id = data.company.company_id
        this.original_company_address = data.company.company_address
        this.company_address = data.company.company_address
    }


    close(): void {
        this.dialogRef.close();
        this.updateCompanySubscription?.unsubscribe();
    }

    dataCheck() {
        if (this.company_name.length == 0)
            return false
        if (this.company_address.length == 0)
            return false
        return true
    }

    updateCompany = async () => {
        if (this.dataCheck() == false) {
            return
        }
        if (this.company_name == this.original_company_name && this.company_address == this.original_company_address) {
            this.dialogRef.close();
            return
        }
        this.updateCompanySubscription = this.adminService.updateCompany(this.company_name.trim(), this.company_id, this.company_address.trim())
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 202) {
                            this.dialogRef.close({ company_name: this.company_name });
                            return;
                        }

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
                    console.log("data : ", data)
                    this.dialogRef.close(data);
                }
            });
    }
}
