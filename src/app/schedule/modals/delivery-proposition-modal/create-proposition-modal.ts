import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../../services/schedule.service';
import { ManagerService } from '../../../services/manager.service';
import { PropositionService } from '../../../services/proposition.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-your-component',
  templateUrl: './create-proposition-modal.html',
  styleUrls: ['./create-proposition-modal.scss'],
})
export class PropositionComponent {
  isModalOpen = true;
  loading = false;
  companyUsers: any[] = [];
  deliveries: any[] = [];

  schedulePropositions: any[] = [];

    constructor(
        private scheduleService: ScheduleService,
        private managerService: ManagerService,
        private propositionService: PropositionService
    ) {
        this.getCompanyData().then(() => {
            for (const user of this.companyUsers)
                this.getAllSchedulePerUser(user.user_id).then(() => {
                    console.log('Schedule retrieved');
                });
        });
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal(event: Event) {
        event.stopPropagation();
        this.isModalOpen = false;
    }

    accept(day: any) {
        console.log('Accepted', day);
        this.SendPropositionAnswer(
            day.date,
            day.deliveries.map((delivery: any) => Number(delivery.schedule_id)),
            true,
            day.deliveries[0].user.user_id
        ).then(() => {
            console.log('Proposition accepted');
        });
    }

    decline(day: any) {
        console.log('Declined', day);
        this.SendPropositionAnswer(
            day.date,
            day.deliveries.map((delivery: any) => Number(delivery.schedule_id)),
            false,
            day.deliveries[0].user.user_id
        ).then(() => {
            console.log('Proposition declined');
        });
    }

    getAllSchedulePerUser(user_id: any): Promise<void> {
        console.log('getAllSchedulePerUser() called', user_id);
        return new Promise<void>((resolve, reject) => {
            this.loading = true;

            const startDateFormatted = new Date('1970-01-01T00:00:00.000Z').toISOString();
            const endDateFormatted = new Date('2100-12-31T23:59:59.999Z').toISOString();

            this.scheduleService
                .getScheduleBetweenDatesByUser(startDateFormatted, endDateFormatted, user_id)
                .pipe(
                    tap({
                        next: (data: any[]) => {
                            if (!data || data.length === 0) {
                                resolve();
                                return;
                            }

                            console.log('getAllSchedule() response:', data);

                             // Group deliveries by delivery_date and user
                            const groupedDeliveries: any = {};
                            data.forEach(delivery => {
                                // Extract day, month, and year from delivery_date
                                const date = new Date(delivery.delivery_date);
                                const day = date.getDate();
                                const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
                                const year = date.getFullYear();

                                // Create key using day, month, and year
                                const key = `${year}-${month}-${day}_${delivery.user.user_id}`;

                                if (!groupedDeliveries[key]) {
                                    groupedDeliveries[key] = {
                                        date: `${year}-${month}-${day}`, // Format date as needed
                                        deliveries: [],
                                        user: delivery.user.name // Assuming user.name is available
                                    };
                                }

                                groupedDeliveries[key].deliveries.push(delivery);
                            });
                            console.log('Grouped Deliveries:', groupedDeliveries);

                            const newPropositions = Object.values(groupedDeliveries)
                            .filter((group: any) => group.deliveries.some((delivery: any) => delivery.proposition === true));

                            this.schedulePropositions = [...this.schedulePropositions, ...newPropositions];


                            console.log('Schedule Propositions:', this.schedulePropositions);

                            resolve();
                        },
                        error: (err) => {
                            reject(err);
                        },
                        complete: () => {
                            this.loading = false; // Ensure loading is set to false when complete
                        }
                    })
                )
                .subscribe();
        });
    }

    async SendPropositionAnswer(date: string, schedule_ids: [], accept: boolean, user_id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.propositionService.SendProposition(date, schedule_ids, accept, user_id).subscribe({
                next: (response: any) => {
                    console.log("SendPropositionAnswer() response:", response);
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in SendPropositionAnswer():", error);
                    reject(error);
                }
            });
        });
    }

    async getCompanyData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.managerService.getManagerEntreprise().subscribe({
                next: (response: any) => {
                    console.log("getCompanyData() response:", response);
                    this.companyUsers = response.users || [];
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getCompanyData():", error);
                    reject(error);
                }
            });
        });
    }
}
