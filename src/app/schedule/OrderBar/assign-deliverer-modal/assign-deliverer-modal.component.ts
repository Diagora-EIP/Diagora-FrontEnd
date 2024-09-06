import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from '../../../services/manager.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ScheduleService } from '../../../services/schedule.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-assign-deliverer-modal',
    templateUrl: './assign-deliverer-modal.html',
    styleUrls: ['./assign-deliverer-modal.scss'],
})
export class AssignDelivererModal implements AfterViewInit {
    @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLInputElement>; // ViewChild for the description input

    delivererForm: FormGroup;
    errorMessage: string = '';
    livreurList: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<AssignDelivererModal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private managerService: ManagerService,
        private snackBarService: SnackbarService
    ) {
        this.delivererForm = this.fb.group({
            livreur: [this.livreurList[0], Validators.required], // Default to "Aucun"
        });

        this.getCompanyData();
    }

    async getCompanyData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    console.log("getCompanyData() response:", response);
                    this.livreurList = response.users || [];
                    this.livreurList.unshift({ user_id: null, name: "Aucun" });
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getCompanyData():", error);
                    reject(error);
                }
            });
        });
    }

    submitForm() {
        if (this.delivererForm.valid) {
            const formData = this.delivererForm.value;

            if (formData.livreur.name === 'Aucun') {
                // Handle case when no deliverer is selected
                this.snackBarService.warningSnackBar('No deliverer selected!');
                return;
            }
            console.log("Livreur", formData.livreur, this.data);
            // const newSchedule = {
            //     delivery_date: deliveryDateTime,
            //     estimated_time,
            //     actual_time,
            //     order_date,
            //     description,
            //     delivery_address,
            //     client_id: client.client_id,
            // };
            // this.scheduleService.createScheduleByUser(this.data.currUser.user_id, newSchedule).pipe(
            //     tap({
            //         next: data => {
            //             this.snackBarService.successSnackBar('La livraison a été créée avec succès !');
            //             this.closeDialog(data);
            //         },
            //         error: error => {
            //             console.log(error);
            //             this.snackBarService.warningSnackBar('Erreur lors de la création de la livraison !');
            //             this.closeDialog(error);
            //         }
            //     })).subscribe();

            // Handle form submission logic here
            const selectedDeliverer = formData.livreur;

            // Example of a callback or service call
            this.snackBarService.successSnackBar('Deliverer selected successfully!');
            this.closeDialog(selectedDeliverer);
        }
    }

    ngAfterViewInit(): void {
        // Focus the description input field when the modal opens
        // Uncomment if you need to focus an input
        // this.descriptionInput.nativeElement.focus();
    }

    closeDialog(dataToSend: any): void {
        this.dialogRef.close(dataToSend);
    }
}
