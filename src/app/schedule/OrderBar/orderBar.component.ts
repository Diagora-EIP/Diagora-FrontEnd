import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orders.service';

@Component({
    selector: 'order-bar',
    templateUrl: './orderBar.component.html',
    styleUrls: ['./orderBar.component.scss']
})
export class OrderBarComponent implements OnInit {
    orders: any[] = [];

    constructor(private OrderService: OrderService) { }

    ngOnInit(): void {
        this.getAllOrdersBetweenDate("2021-01-01", "2024-07-30").then(() => {
            console.log("Orders between dates retrieved");
        });
    }

    async getAllOrdersBetweenDate(start: string, end: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.OrderService.getOrdersBetweenDates(start, end).subscribe({
                next: (response: any) => {
                    console.log("getAllOrdersBetweenDate() response:", response);
                    this.orders = response;
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getAllOrdersBetweenDate():", error);
                    reject(error);
                }
            });
        });
    }

    assignOrder(order: any): void {
        console.log(`Assigning order with ID: ${order.order_id}`);
        // Add logic to assign the order to a user
    }
}
