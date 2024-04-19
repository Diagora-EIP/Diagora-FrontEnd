import { Injectable } from '@angular/core';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {

  constructor(public dialog: MatDialog) { }

  openConfirmModal(title: string): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        data: { title }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }
}
