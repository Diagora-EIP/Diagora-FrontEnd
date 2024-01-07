import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-details-command',
	templateUrl: './details-command.component.html',
	styleUrls: ['./details-command.component.scss']
})
export class DetailsCommandComponent {

	info: any;
	delivery_address: string = '';
	order_date: string = '';
	description: string = '';

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DetailsCommandComponent>) {
		this.info = data;
		this.delivery_address = this.info.delivery_address;
		this.description = this.info.description;
		const date = new Date(this.info.order_date);
		const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const dateFormated = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day;
		this.order_date = dateFormated;
	}

	close(): void {
		this.dialogRef.close();
	}
}
