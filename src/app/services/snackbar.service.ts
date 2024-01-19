import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,} from '@angular/material/snack-bar'; 


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar:MatSnackBar) { }

  public warningSnackBar(message:string) {
    this.openSnackBar(message, ['warning-snackbar']);

  }

  public successSnackBar(message:string) {
    
    this.openSnackBar(message, ['success-snackbar']);
  }

  public openSnackBar(message:string, panelClass: string[], duration: number = 2500, dismissButtonText: string | undefined = undefined) {
    this.snackBar.open(message, dismissButtonText, {
      duration: duration,
      panelClass: panelClass,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      
    });
  }
}
