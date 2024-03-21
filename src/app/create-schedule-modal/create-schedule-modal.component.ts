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
    newClientForm: FormGroup;
    errorMessage: string = '';
    clientsList: any = [];
    displayNewClient: boolean = false;
    displayClientAlreadyExists: boolean = false;

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

        this.newClientForm = this.fb.group({
            name: [data.name, Validators.required],
            surname: [data.surname, Validators.required],
            email: [data.email, Validators.required],
            address: [data.address, Validators.required],
        });

        this.getClients();
    }
    
    updateAdress(client: any){
        console.log("updateAdress", client)
        this.scheduleForm.patchValue({
            deliveryAddress: client.address
        });
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

    addNewClient() {
        if (this.newClientForm.valid) {
            const formData = this.newClientForm.value;
            const newClient = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                address: formData.address,
            };
            const already = this.clientsList.find((client: { email: string; }) => client.email === newClient.email);
            if (already) {
                this.displayClientAlreadyExists = true
            } else {
                this.createClient();
            }
        }
    }
    
    createClient() {
        const formData = this.newClientForm.value;
        const newClient = {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            address: formData.address,
        };
        this.clientService.createClient(newClient).subscribe(
            (res) => {
                console.log(res);
                // Check the HTTP status
                if (res.status && res.status !== 201) {
                    this.errorMessage =
                        'Failed to create client. Please try again.';
                }
            }
        );
        this.displayClientAlreadyExists = false;
        this.displayNewClient = false;
        this.newClientForm.reset();
        this.clientsList.push(newClient);
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
            console.log(newSchedule)
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
