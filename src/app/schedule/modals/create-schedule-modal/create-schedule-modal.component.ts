// create-schedule-modal.component.ts

import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VisualizeScheduleDayComponent } from '../visualize-schedule-day/visualize-schedule-day.component';
import { ClientService } from '../../../services/client.service';
import { ScheduleService } from '../../../services/schedule.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { tap } from 'rxjs';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
    selector: 'app-create-schedule-modal',
    templateUrl: './create-schedule-modal.component.html',
    styleUrls: ['./create-schedule-modal.component.scss'],
})
export class CreateScheduleModalComponent implements AfterViewInit {
    @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLInputElement>; // ViewChild for the description input

    scheduleForm: FormGroup;
    newClientForm: FormGroup;
    errorMessage: string = '';
    userName: string = '';
    clientsList: any = [];
    displayNewClient: boolean = false;
    displayClientAlreadyExists: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<CreateScheduleModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private permissionsService: PermissionsService,
        private clientService: ClientService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
    ) {
        this.scheduleForm = this.fb.group({
            deliveryDate: [new Date(this.data.start), Validators.required],
            description: [this.data.description, Validators.required],
            deliveryTime: ['12:00', Validators.required], // Default time, adjust as needed
            client: [data.client, Validators.required],
            deliveryAddress: [this.data.delivery_address, Validators.required],
        });
        this.userName = this.data.currUser.name;
        this.newClientForm = this.fb.group({
            name: [data.name, Validators.required],
            surname: [data.surname, Validators.required],
            email: [data.email, Validators.required],
            address: [data.address, Validators.required],
        });

        this.getClients();
    }

    updateAdress(client: any) {
        this.scheduleForm.patchValue({
            deliveryAddress: client.address
        });
    }

    getClients() {
        this.clientService
            .getAllClientsByCompany()
            .pipe(
                tap({
                    next: data => {
                        this.clientsList = data;
                    },
                    error: error => {
                        console.log(error);
                    }
                })
            ).subscribe();
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
            const already = this.clientsList?.find((client: { email: string; }) => client.email === newClient.email);
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
        this.clientService.
            createClient(newClient).subscribe({
                next: (data) => {
                    this.displayClientAlreadyExists = false;
                    this.displayNewClient = false;
                    this.newClientForm.reset();
                    console.log("Client created", data)
                    if (this.clientsList === null)
                        this.clientsList = [data];
                    else
                        this.clientsList = [...this.clientsList, data];
                },
                error: (error) => {
                    this.errorMessage = 'Failed to create client. Please try again.';
                }
            });
    }

    ngAfterViewInit(): void {
        // Focus the description input field when the modal opens

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
            if (!this.checkPermission('manager')) {
                this.scheduleService.createSchedule(newSchedule).pipe(
                    tap({
                        next: data => {
                            this.snackBarService.successSnackBar('La livraison a été créée avec succès !');
                            this.closeDialog(data);
                        },
                        error: error => {
                            console.log(error);
                            this.snackBarService.warningSnackBar('Erreur lors de la création de la livraison !');
                            this.closeDialog(error);
                        }
                    })).subscribe();
            } else {
                this.scheduleService.createScheduleByUser(this.data.currUser.user_id, newSchedule).pipe(
                    tap({
                        next: data => {
                            this.snackBarService.successSnackBar('La livraison a été créée avec succès !');
                            this.closeDialog(data);
                        },
                        error: error => {
                            console.log(error);
                            this.snackBarService.warningSnackBar('Erreur lors de la création de la livraison !');
                            this.closeDialog(error);
                        }
                    })).subscribe();
            }
        }
    }

    combineDateAndTime(date: Date, time: string): string {
        const combinedDateTime = new Date(date);
        const timeParts = time.split(':');
        combinedDateTime.setHours(Number(timeParts[0]));
        combinedDateTime.setMinutes(Number(timeParts[1]));
        return combinedDateTime.toISOString();
    }

    closeDialog(dataToSend: any): void {
        this.dialogRef.close(dataToSend);
    }

    checkPermission(permission: string): boolean {
        if (localStorage.getItem('token') === null) {
            return false;
        }
        return this.permissionsService.hasPermission(permission);
    }

    visualizeDay() {
        this.closeDialog(null);
        console.log("marche pas")
        console.log("start", this.data.start)
        console.log("end", this.data.end)
        console.log("user", this.data.currUser)
        const dialogRef = this.dialog.open(VisualizeScheduleDayComponent, {
            data: {
                start: this.data.start,
                end: this.data.end,
                user: this.data.currUser,
            }
        });
    }
}
