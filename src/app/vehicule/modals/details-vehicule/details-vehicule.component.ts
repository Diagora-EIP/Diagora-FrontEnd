import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-details-vehicule',
    templateUrl: './details-vehicule.component.html',
    styleUrls: ['./details-vehicule.component.scss']
})
export class DetailsVehiculeComponent {
    info: any;
    name: string = '';
    dimentions: string = '';
    capacity: string = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DetailsVehiculeComponent>) {
		this.info = data;
		this.name = this.info.name;
		this.dimentions = this.info.dimentions;
		this.capacity = `${this.info.capacity}`;
	}

	close(): void {
		this.dialogRef.close();
	}
}
