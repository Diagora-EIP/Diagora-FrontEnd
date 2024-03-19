// create-schedule-modal.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../services/schedule.service';
import { ClientService } from '../services/client.service';

@Component({
    selector: 'app-create-schedule-modal',
    templateUrl: './create-schedule-modal.component.html',
    styleUrls: ['./create-schedule-modal.component.scss'],
})
export class CreateScheduleModalComponent {
    scheduleForm: FormGroup;
    errorMessage: string = '';
    clientsList: any = [];

    constructor(
        public dialogRef: MatDialogRef<CreateScheduleModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private clientService: ClientService,
    ) {
        this.scheduleForm = this.fb.group({
            deliveryDate: [new Date(data.delivery_date), Validators.required],
            description: [data.description, Validators.required],
            deliveryTime: ['12:00', Validators.required], // Default time, adjust as needed
            deliveryAddress: [data.delivery_address, Validators.required],
            client: [data.client, Validators.required],
        });

        this.getClients();
    }

    getClients() {
        this.clientService.getAllClientsByCompany().subscribe(
            (res) => {
                console.log(res);
                this.clientsList = res;
            },
            (error) => {
                console.error(error);
            }
        );

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
            const client = formData.client;

            const newSchedule = {
                delivery_date: deliveryDateTime,
                estimated_time,
                actual_time,
                order_date,
                description,
                delivery_address,
                client_id: client.client_id,
            };
            this.scheduleService.createSchedule(newSchedule).subscribe(
                (res) => {
                    console.log(res);
                    // Check the HTTP status
                    if (res.status && res.status !== 201) {
                        this.errorMessage =
                            'Failed to create schedule. Please try again.';
					} else {
                        this.closeDialog();
                    }
                },
                (error) => {
                    console.error(error);
                    this.errorMessage = 'An error occurred. Please try again.';
                }
            );
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
