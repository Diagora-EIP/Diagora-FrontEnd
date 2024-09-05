import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrderModalComponent } from './create-order-modal/create-order-modal.component';

@Component({
    selector: 'order-bar',
    templateUrl: './orderBar.component.html',
    styleUrls: ['./orderBar.component.scss']
})
export class OrderBarComponent implements OnInit {
    orders: any[] = [];
    filteredOrders: any[] = [];
    searchTerm: string = '';
    startDate: Date | null = null;
    endDate: Date | null = null;

    constructor(private OrderService: OrderService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.getAllOrdersBetweenDate("2021-01-01", "2024-07-30").then(() => {
            this.applyFilters();
        });
    }

    async getAllOrdersBetweenDate(start: string, end: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.OrderService.getOrdersBetweenDates(start, end).subscribe({
                next: (response: any) => {
                    console.log("getAllOrdersBetweenDate() response:", response);
                    this.orders = response;
                    this.filteredOrders = this.orders;
                    resolve();
                },
                error: (error: any) => {
                    console.error("Error in getAllOrdersBetweenDate():", error);
                    reject(error);
                }
            });
        });
    }

    openCreateOrder(): void {
        const dialogRef = this.dialog.open(CreateOrderModalComponent, {
            width: '600px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(`Order created: ${result}`);
                this.orders.push(result);
                this.applyFilters();
            }
        });
    }


    applyFilters(): void {
        // Ensure searchTerm is initialized
        const searchTerm = this.searchTerm ? this.searchTerm.toLowerCase() : '';
    
        // Filter orders based on searchTerm and date range
        this.filteredOrders = this.orders.filter(order => {
            // Handle undefined order.description
            const orderDescription = order.description ? order.description.toLowerCase() : '';
    
            // Check if description matches searchTerm
            const matchesSearch = orderDescription.includes(searchTerm);
    
            // Create Date object for order_date
            const orderDate = new Date(order.order_date);
            
            // Check date range
            const matchesDate = (!this.startDate || orderDate >= this.startDate) &&
                                (!this.endDate || orderDate <= this.endDate);
    
            return matchesSearch && matchesDate;
        });
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.startDate = null;
        this.endDate = null;
        this.applyFilters();
    }

    assignOrder(order: any): void {
        console.log(`Assigning order with ID: ${order.order_id}`);
        // Add logic to assign the order to a user
    }
}
