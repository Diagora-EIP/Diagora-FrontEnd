// create-schedule-modal.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../../../services/schedule.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-create-schedule-modal',
    templateUrl: './create-schedule-modal.component.html',
    styleUrls: ['./create-schedule-modal.component.scss'],
})
export class CreateScheduleModalComponent {
    scheduleForm: FormGroup;
    errorMessage: string = '';

    constructor(
        public dialogRef: MatDialogRef<CreateScheduleModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private snackBarService: SnackbarService
    ) {
        this.scheduleForm = this.fb.group({
            deliveryDate: [new Date(data.delivery_date), Validators.required],
            description: [data.description, Validators.required],
            deliveryTime: ['12:00', Validators.required], // Default time, adjust as needed
            deliveryAddress: [data.delivery_address, Validators.required],
        });
    }

    submitForm() {
        if (this.scheduleForm.valid) {
            const formData = this.scheduleForm.value;
			const deliveryDateTime = this.combineDateAndTime(formData.deliveryDate, formData.deliveryTime);
            const estimated_time = 4200;
            const actual_time = 3600;
            const order_date = formData.deliveryDate;
            const description = formData.description;
            const delivery_address = formData.deliveryAddress;

            const newSchedule = {
                delivery_date: deliveryDateTime,
                estimated_time,
                actual_time,
                order_date,
                description,
                delivery_address,
            };
            this.scheduleService.createSchedule(newSchedule).pipe(
                tap({
                    next: data => {
                        this.snackBarService.successSnackBar('La livraison a été créée avec succès !');
                        this.closeDialog();
                    },
                    error: error => {
                        console.log(error);
                        this.snackBarService.warningSnackBar('Erreur lors de la création de la livraison !');
                        this.closeDialog();
                    }
                })).subscribe();
        }
    }

    combineDateAndTime(date: Date, time: string): string {
        const combinedDateTime = new Date(date);
        const timeParts = time.split(':');
        combinedDateTime.setHours(Number(timeParts[0]));
        combinedDateTime.setMinutes(Number(timeParts[1]));
        return combinedDateTime.toISOString();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
