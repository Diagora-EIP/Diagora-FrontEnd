// create-schedule-modal.component.ts

import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { VisualizeScheduleDayComponent } from '../visualize-schedule-day/visualize-schedule-day.component';
import { ClientService } from '../../../services/client.service';
import { ScheduleService } from '../../../services/schedule.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { tap } from 'rxjs';
import { PermissionsService } from '../../../services/permissions.service';
import { ManagerService } from '../../../services/manager.service';
import { CommandsService } from '../../../services/commands.service';

@Component({
    selector: 'app-create-order-modal',
    templateUrl: './create-order-modal.component.html',
    styleUrls: ['./create-order-modal.component.scss'],
})
export class CreateOrderModalComponent implements AfterViewInit {
    @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLInputElement>; // ViewChild for the description input

    scheduleForm: FormGroup;
    newClientForm: FormGroup;
    errorMessage: string = '';
    clientsList: any = [];
    displayNewClient: boolean = false;
    displayClientAlreadyExists: boolean = false;
    livreurList: any = [];

    constructor(
        public dialogRef: MatDialogRef<CreateOrderModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private permissionsService: PermissionsService,
        private clientService: ClientService,
        private snackBarService: SnackbarService,
        private dialog: MatDialog,
        private managerService: ManagerService,
        private CommandsService: CommandsService,
    ) {
        const defaultClient = {
            name: '',
            surname: '',
            email: '',
            address: ''
        };
        this.scheduleForm = this.fb.group({
            livreur: [this.livreurList[0], Validators.required], // Default to "Aucun"
            deliveryDate: [new Date(this.data.start), Validators.required],
            description: [this.data.description, Validators.required],
            deliveryTime: ['12:00', Validators.required], // Default time
            client: [data.client, Validators.required],
            deliveryAddress: [this.data.delivery_address, Validators.required],
        });
        this.newClientForm = this.fb.group({
            name: [data.name, Validators.required],
            surname: [data.surname, Validators.required],
            email: [data.email, Validators.required],
            address: [data.address, Validators.required],
        });

        this.getClients();
        this.getCompanyData();
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
            if (this.checkPermission('manager')) {
                if (formData.livreur.name === 'Aucun') {
                    this.CommandsService.createOrderV2(formData.description, deliveryDateTime, formData.deliveryAddress, client.client_id).subscribe({
                        next: data => {
                            this.snackBarService.successSnackBar('La livraison a été créée avec succès !');
                            this.closeDialog(data);
                        },
                        error: error => {
                            console.log(error);
                            this.snackBarService.warningSnackBar('Erreur lors de la création de la livraison !');
                            this.closeDialog(error);
                        }
                    });
                } else {
                    this.scheduleService.createScheduleByUser(formData.livreur.user_id, newSchedule).pipe(
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
        // const dialogRef = this.dialog.open(VisualizeScheduleDayComponent, {
        //     data: {
        //         start: this.data.start,
        //         end: this.data.end,
        //         user: this.data.currUser,
        //     }
        // });
    }
}
