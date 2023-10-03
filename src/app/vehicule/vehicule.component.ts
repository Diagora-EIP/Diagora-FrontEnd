import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  id: number,
  marque: number,
  modele: string,
}

@Component({
  selector: 'app-vehicule',
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.scss']
})
export class VehiculeComponent {
  logout1!: boolean;
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.logout1 = false;
  }

  goto(params: string) {
    this.router.navigate([params]);
  }

  logout() {
    this.logout1 = true;
  }

  cancel() {
    this.logout1 = false;
  }

  confirm() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  openDialog(id:number = 0, marque:string = '', modele:string = ''): void {
    this.dialog.open(DetailsModalComponent, {
      data: {
        id: id,
        marque: marque,
        modele: modele,
      }
    });
  }

  vehiculeAction(type:string = 'null'): void {
    if (type === 'null') { return; }
    else if (type === 'AddVehicule') {
      this.dialog.open(AddVehiculeModalComponent);
    }
    else if (type === 'EditVehicule') {
      this.dialog.open(EditVehiculeModalComponent);
    }
    else if (type === 'DeleteVehicule') {
      this.dialog.open(DeleteVehiculeModalComponent);
    }
  }
}

@Component({
  selector: 'details-modal.component',
  templateUrl: './details-modal.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})

export class DetailsModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'add-vehicule-modal.component',
  templateUrl: './add-vehicule-modal.component.html',
  styleUrls: ['./add-vehicule-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf, MatButtonModule, MatDialogModule],
})

export class AddVehiculeModalComponent {
  requiredValue = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();
}

@Component({
  selector: 'delete-vehicule-modal.component',
  templateUrl: './delete-vehicule-modal.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
})

export class DeleteVehiculeModalComponent { }

@Component({
  selector: 'edit-vehicule-modal.component',
  templateUrl: './edit-vehicule-modal.component.html',
  styleUrls: ['./edit-vehicule-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
})

export class EditVehiculeModalComponent { }
