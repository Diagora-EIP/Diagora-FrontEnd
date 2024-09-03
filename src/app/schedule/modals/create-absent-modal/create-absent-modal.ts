import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbsenceService } from '../../../services/absence.service';

@Component({
  selector: 'app-create-absent-modal',
  templateUrl: './create-absent-modal.html',
  styleUrls: ['./create-absent-modal.scss']
})
export class DelivererAbsenceModalComponent {
  absenceDate: Date = new Date();
  declaredAbsences: Date[] = [];
  user: any;

  constructor(
    public dialogRef: MatDialogRef<DelivererAbsenceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private absenceService: AbsenceService
  ) {
    this.declaredAbsences = data.declaredAbsences || [];
    this.user = data.user; // Retrieve user data
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async declareAbsence(): Promise<void> {
    if (this.absenceDate) {
      const absenceDateString = this.absenceDate.toISOString(); // Convert Date to string in YYYY-MM-DD format
      
      return new Promise<void>((resolve, reject) => {
        this.absenceService.createAbsence(this.user.user_id, absenceDateString).subscribe({
          next: (response: any) => {
            this.declaredAbsences.push(this.absenceDate);
            this.dialogRef.close(this.absenceDate);
            resolve();
          },
          error: (error: any) => {
            console.error("Error in declareAbsence():", error);
            reject(error);
          }
        });
      });
    }
  }
}
