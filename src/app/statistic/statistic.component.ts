import { Component } from '@angular/core';
import { Chart, registerables } from "chart.js";
import { StatisticService } from '../services/statistic.service';
import { ClientService } from '../services/client.service';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
    livraisonChart: Chart = Chart.prototype;
    mileageChart: Chart = Chart.prototype;
    expenseChart: Chart = Chart.prototype;
    vehicleDeliveryChart: Chart = Chart.prototype;
    data = [12, 19, 3, 29, 6, 3, 2, 10, 6, 3, 7, 9, 10, 11, 27, 8, 14, 2, 9, 4, 5, 24, 7, 4, 9, 10, 11, 27, 8, 23, 2];
    dataSum = this.data.reduce((a, b) => a + b, 0);
    clientCount = 0;
    monthExpense = []
    totalExpense = 0
    clientOrder = []
    monthOrder = []
    totalOrder = 0;
    monthClientCount = 0
    clientList = []
    clientDeliveryChart: Chart<'doughnut'> = Chart.prototype;

    constructor(private statisticService: StatisticService, private clientService: ClientService) {
        this.getClientList();
    }

    ngAfterViewInit(): void {
        Chart.register(...registerables);

        this.generateHorizontalChart();
        this.getClientCount();
        this.getExpense();
    }

    getClientList(): void {
        this.clientService.getAllClientsByCompany()
            .subscribe({
                next: (data) => {
                    this.clientList = data;
                    this.getOrder();
                },
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
                    this.clientOrder = data.client_order_count;
                    this.monthOrder = data.order_of_month;
                    this.totalOrder = this.monthOrder.reduce((a, b: any) => a + b.count, 0);
                    this.monthClientCount = this.clientOrder.length
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
                    borderColor: 'rgb(209, 209, 209)',
                    backgroundColor: 'rgb(233, 233, 233)',
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

    generateHorizontalChart(): void {
        const dataChart = [
            { value: 65, delivery: 100 },
            { value: 59, delivery: 120 },
            { value: 80, delivery: 90 },
            { value: 81, delivery: 110 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
            { value: 56, delivery: 95 },
        ]
        this.vehicleDeliveryChart = new Chart('vehicleDeliveryChart', {
            type: 'bar',
            data: {
                labels: ['Audi', 'Clio', 'BMW', 'BUS', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion', 'Camion'],
                datasets: [{
                    label: 'Km',
                    data: dataChart.map(data => data.value),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const data = dataChart[context.dataIndex];
                                label += data.value + ' (livraison: ' + data.delivery + ')';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
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
}
