import { Component, Type } from '@angular/core';
import { Chart, registerables } from "chart.js";
import { StatisticService } from '../services/statistic.service';
import { ClientService } from '../services/client.service';
import { VehiculesService } from '../services/vehicules.service';
import { MatDialog } from '@angular/material/dialog';
import { EditVehiculeExpenseComponent } from './modals/edit-vehicule-expense/edit-vehicule-expense.component';
import { SnackbarService } from '../services/snackbar.service';

const modalComponentMapping: { [key: string]: Type<any> } = {
    EDIT: EditVehiculeExpenseComponent,
};
@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
    modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
        EDIT: {
            component: EditVehiculeExpenseComponent,
            constructor: () => {
                return {
                    data: this.selectedExpense,
                }
            },
            action: (instance: any) => {
                this.getUserVehicleExpense();
            }
        },
    };
    livraisonChart: Chart = Chart.prototype;
    mileageChart: Chart = Chart.prototype;
    expenseChart: Chart = Chart.prototype;
    vehicleDeliveryChart: Chart = Chart.prototype;
    clientCount = 0;
    monthExpense = []
    totalExpense = 0
    clientOrder = []
    monthOrder = []
    totalOrder = 0;
    monthClientCount = 0
    clientList = []
    totalMileage = 0;
    monthMileage = []
    lockCount = []
    vehicleList = []
    vehicleExpenses: any[] = [];
    expensesColumns = ['title', 'description', 'vehicle.name', 'amount', 'action'];
    selectedExpense: any = null;

    // expensesColumns = ['title', 'description', 'amount'];

    clientDeliveryChart: Chart<'doughnut'> = Chart.prototype;

    constructor(
        private statisticService: StatisticService,
        private clientService: ClientService,
        private vehiculesService: VehiculesService,
        public dialog: MatDialog,
        private snackBarService: SnackbarService,
    ) {
        this.getUserVehicleExpense()
        this.getClientList();
    }

    ngAfterViewInit(): void {
        Chart.register(...registerables);
        this.getClientCount();
        this.getExpense();
    }

    getClientList(): void {
        this.clientService.getAllClientsByCompany()
            .subscribe({
                next: (data) => {
                    this.clientList = data;
                    this.getVehicules();
                    }
            });
    }

    getVehicules() {
        this.vehiculesService.getVehicules()
            .subscribe((data) => {
                this.vehicleList = data;
                this.getOrder();
            });
    }

    getClientCount(): void {
        this.statisticService.getClientCount()
            .subscribe({
                next: (data) => {
                    this.clientCount = data;
                },
            });
    }

    getExpense(): void {
        this.statisticService.getExpense()
            .subscribe({
                next: (data) => {
                    this.monthExpense = data;
                    this.totalExpense = this.monthExpense.reduce((a, b: any) => a + b.amount, 0);
                    this.expenseChart = this.createChart('expenseChart',
                        'Dépenses',
                        this.monthExpense.map((expense: any) => {
                            const date = new Date(expense.date);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear().toString();
                            return `${day} ${month} ${year}`;
                        }),
                        this.monthExpense.map((expense: any) => expense.amount)
                    );
                },
            });
    }

    getOrder(): void {
        this.statisticService.getOrder()
            .subscribe({
                next: (data) => {
                    console.log("getOrder =>", data);
                    this.clientOrder = data.client_order_count;
                    this.monthOrder = data.order_of_month;
                    this.totalOrder = this.monthOrder.reduce((a, b: any) => a + b.count, 0);
                    this.monthClientCount = this.clientOrder.length
                    this.monthMileage = data.mileage_of_month
                    this.totalMileage = this.monthMileage.reduce((a, b: any) => a + b.mileage, 0);
                    this.lockCount = data.lock_order_count;

                    this.livraisonChart = this.createChart(
                        'livraisonChart',
                        'Nombre de commandes',
                        this.monthOrder.map((order: any) => {
                            const date = new Date(order.date);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear().toString();
                            return `${day} ${month} ${year}`;
                        }),
                        this.monthOrder.map((order: any) => order.count)
                    )

                    this.mileageChart = this.createChart(
                        'mileageChart',
                        'Km',
                        this.monthMileage.map((mileage: any) => {
                            const date = new Date(mileage.date);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear().toString();
                            return `${day} ${month} ${year}`;
                        }),
                        this.monthMileage.map((mileage: any) => mileage.mileage)
                    );

                    this.vehicleDeliveryChart = this.generateHorizontalChart(
                        'vehicleDeliveryChart',
                        'Nombre de commandes',
                        this.lockCount.map((lock: any) => {
                            const matchedVehicle: any = this.vehicleList.find((v: any) => +v.vehicle_id === +lock.vehicle_id);
                            return matchedVehicle ? (matchedVehicle.name.length < 8 ? matchedVehicle.name.padEnd(8, ' ') : matchedVehicle.name.slice(0, 8) + '...') : '';
                        }),
                        this.lockCount.map((lock: any) => lock.lock_count)
                    );

                    this.clientDeliveryChart = this.generateDonutChart(
                        'clientDeliveryChart',
                        'Nombre de commandes',
                        this.clientOrder.map((client: any) => {
                            const matchedClient: any = this.clientList.find((c: any) => +c.client_id === +client.client_id);
                            return matchedClient ? (matchedClient.name.length < 8 ? matchedClient.name.padEnd(8, ' ') : matchedClient.name.slice(0, 8) + '...') : '';
                        }),
                        this.clientOrder.map((client: any) => client.schedule_count)
                    );
                },
            });
    }

    createChart(name: string, label: string, label_title: string[], data: number[]) {

        return new Chart(name, {
            type: 'line',
            data: {
                labels: label_title,
                datasets: [{
                    label: label,
                    data: data,
                    fill: true,
                    tension: 0.4,
                    borderColor: '#01ABA8',
                    backgroundColor: '#01aba8b9',
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        display: false,
                        max: 1.75 * Math.max(...data)
                    },
                    x: {
                        display: false
                    }
                },
                interaction: {
                    intersect: false,
                }
            }
        });
    }

    generateHorizontalChart(name: string, label: string, label_title: string[], data: number[]) {
        console.log(data);
        return new Chart(name, {
            type: 'bar',
            data: {
                labels: label_title,
                datasets: [{
                    label: label,
                    data: data,
                    // borderWidth: 1,
                    // borderColor: '#01ABA8',
                    // backgroundColor: '#01aba8b9',
                    backgroundColor: 'rgba(1, 171, 168, 0.75)',
                    borderColor: 'rgba(1, 130, 128, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'x',
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            // label: (context) => {
                            //     let label = context.dataset.label || '';
                            //     if (label) {
                            //         label += ': ';
                            //     }
                            //     const data = dataChart[context.dataIndex];
                            //     label += data.value + ' (livraison: ' + data.delivery + ')';
                            //     return label;
                            // }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                    },
                    y: {
                        min: 0,
                        max: Math.max(...data),
                        grid: {
                            display: false
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    generateDonutChart(name: string, label: string, label_title: string[], data: number[]) {
        return new Chart(name, {
            type: 'doughnut',
            data: {
                labels: label_title,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)', // Couleur pour Client A
                        'rgba(54, 162, 235, 0.5)',  // Couleur pour Client B
                        'rgba(255, 206, 86, 0.5)',  // Couleur pour Client C
                        'rgba(75, 192, 192, 0.5)',  // Couleur pour Client D
                        'rgba(153, 102, 255, 0.5)', // Couleur pour Client E
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'left'
                    }
                }
            }
        });
    }

    getUserVehicleExpense() {
        this.vehiculesService.getUserVehicleExpenses()
            .subscribe({
                next: (data) => {
                    this.vehicleExpenses = data;
                    console.log(this.vehicleExpenses)
                }
            });
    }

    editExpense(expense: any) {
        this.selectedExpense = expense;
        const { component, constructor, action } = this.modalComponentMapping["EDIT"];

        if (!component) {
            throw new Error(`Type de modal non pris en charge : "EDIT"`);
        }

        const dialogRef = this.dialog.open(component, {
            panelClass: 'custom',
            data: constructor()
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (!data)
                return
            action(data);
        });
    }

    deleteExpense(expense: any) {
        this.vehiculesService.deleteVehicleExpense(expense.vehicle_expense_id)
            .subscribe({
                next: () => {
                    this.getUserVehicleExpense();
                    this.snackBarService.successSnackBar('La dépense a été supprimée avec succès !');
                }
            });
    }
}
