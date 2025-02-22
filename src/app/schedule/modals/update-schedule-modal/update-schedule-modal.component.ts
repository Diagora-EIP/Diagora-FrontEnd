// update-schedule-modal.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../../../services/schedule.service';
import { ClientService } from '../../../services/client.service';
import { OrderService } from '../../../services/orders.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-update-schedule-modal',
    templateUrl: './update-schedule-modal.component.html',
    styleUrls: ['./update-schedule-modal.component.scss'],
})
export class UpdateScheduleModalComponent {
    updateForm: FormGroup;
    errorMessage: string = '';
    start: string;
    description: string;
    scheduleId: number;
    order: any; // You may need to define the order type based on your data structure
    itineraryId: number;
    estimatedTime: any; // You may need to define the type based on your data structure
    actualTime: any; // You may need to define the type based on your data structure
    status: any; // You may need to define the type based on your data structure
    manager: boolean
    user: any
    clientId: number
    clientName: string = '';

    constructor(
        public dialogRef: MatDialogRef<UpdateScheduleModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private scheduleService: ScheduleService,
        private clientService: ClientService,
        private orderService: OrderService,
        private router: Router,
        private snackBarService: SnackbarService
    ) {
        // Initialize variables based on the data
        this.start = data.start;
        this.description = data.title;
        this.scheduleId = parseInt(data.scheduleId) || 0;
        this.order = {
            orderId: parseInt(data.order.orderId) || 0,
            orderDate: data.order.orderDate,
            deliveryAddress: data.order.deliveryAddress,
            description: data.order.description,
            company: {
                companyId: parseInt(data.order.company.companyId) || 0,
                name: data.order.company.name,
                address: data.order.company.address,
            },
        };
        this.itineraryId = parseInt(data.itineraryId) || 0;
        this.estimatedTime = data.estimatedTime;
        this.actualTime = data.actualTime;
        this.status = data.status;
        this.manager = data.manager;
        this.user = data.user;
        this.clientId = parseInt(data.clientId);
        this.updateForm = this.fb.group({
            deliveryDate: [new Date(this.start), Validators.required],
            deliveryTime: [this.getStartHour(this.start), Validators.required],
            deliveryAddress: [this.order.deliveryAddress, Validators.required],
            // Add other form controls based on your data structure
        });

        // Set the initial values for the form controls
        this.updateForm.patchValue({
            // Set the values based on the data you received
            // Example:
            // deliveryDate: new Date(this.start),
            // deliveryAddress: this.order.deliveryAddress,
        });
        this.getAllClients();
    }

    getStartHour(start: string) {
        return `${new Date(start).getHours().toString().length == 2 ? new Date(start).getHours() : `0${new Date(start).getHours()}`}:${new Date(start).getMinutes() ? new Date(start).getMinutes() : '00'}`
    }

    getAllClients() {
        this.clientService.getAllClientsByCompany().subscribe(
            (data) => {
                let temp = data.find((e: any) => e.client_id == this.clientId);
                this.clientName = temp.name;
            }
        )
    }

    submitForm() {
        if (this.updateForm.valid) {
            const temp = new Date(this.updateForm.value.deliveryDate)
            temp.setHours(this.updateForm.value.deliveryTime.split(':')[0])
            temp.setMinutes(this.updateForm.value.deliveryTime.split(':')[1])
            const estimated_time = 4200;
            const actual_time = 3600;
            
            const newSchedule = {
                delivery_date: temp,
                estimated_time,
                actual_time,
                order_date: this.order.orderDate,
                description: this.order.description,
                delivery_address: this.updateForm.value.deliveryAddress,
                client_id: this.clientId,
            };

            this.scheduleService.deleteSchedule(this.scheduleId).subscribe((res) => {
                console.log(res);
            });

            if (!this.manager) {
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
            } else {
                this.scheduleService.createScheduleByUser(this.user.user_id, newSchedule).pipe(
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

            // const updatedScheduleData = {
            //     delivery_date: temp,
            //     delivery_address: this.updateForm.value.deliveryAddress,
            //     // Add other properties based on your data structure
            // };

            // const updatedOrderData = {
            //     delivery_address: this.updateForm.value.deliveryAddress
            // };

            // if (!this.manager) {
            //     this.scheduleService
            //         .updateSchedule(this.scheduleId, updatedScheduleData)
            //         .pipe(
            //             tap((res) => {
            //                 if (res.status === 'success') {

            //                 } else {
            //                     this.errorMessage = res.message;
            //                 }
            //             })
            //         )
            //         .subscribe((res) => {
            //             console.log(res);
            //             // Handle success or error accordingly
            //         }
            //     )
                
            //     this.orderService
            //         .updateOrderById(this.order.orderId, updatedOrderData)
            //         .pipe(
            //             tap((res) => {
            //                 if (res.status === 'success') {

            //                 } else {
            //                     this.errorMessage = res.message;
            //                 }
            //             })
            //         )
            //         .subscribe((res) => {
            //             console.log(res);
            //             // Handle success or error accordingly
            //         }
            //     )
            // } else {
            //     this.scheduleService
            //         .updateScheduleByUser(this.user?.user_id, this.scheduleId, updatedScheduleData)
            //         .pipe(
            //             tap((res) => {
            //                 if (res.status === 'success') {

            //                 } else {
            //                     this.errorMessage = res.message;
            //                 }
            //             })
            //         )
            //         .subscribe((res) => {
            //             console.log(res);
            //             // Handle success or error accordingly
            //         }
            //         )
            // }
        }
        this.snackBarService.successSnackBar('Le planning a été modifié avec succès !');
        this.closeDialog();
    }

    deleteSchedule() {
        // Add logic to delete the schedule
        // You can call your service method to delete the schedule
        this.scheduleService.deleteSchedule(this.scheduleId).subscribe((res) => {
            console.log(res);
            // Handle success or error accordingly
        });
        this.snackBarService.successSnackBar('Le planning a été supprimé avec succès !');
        this.closeDialog();
    }

    redirectToItineraryPage() {

        if (this.manager) {

            const user_name = this.user?.name;
            const user_id = this.user?.user_id;
            this.closeDialog();
            console.log(this.user);
            this.router.navigate([
                '/carte',
                { date: this.start, user_id: user_id, user_name: user_name },
            ]);
        } else {
            this.closeDialog();
            //code de merde a fix
            const user_name = this.user?.name;
            const user_id = this.user?.user_id;
            console.log(this.start);
            this.router.navigate([
                '/carte',
                { date: this.start, user_id: user_id, user_name: user_name },
            ]);
        }
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
