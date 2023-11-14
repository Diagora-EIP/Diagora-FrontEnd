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
import { CommandsService } from 'src/app/services/commands.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

export interface DialogData {
  id: number,
  name: string,
  date: string,
  address: string,
  livreur: string,
}

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})

export class CommandsComponent {

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

  openDialog(id:number = 0, name:string = '', date:string = '', address:string = '', livreur:string = ''): void {
    this.dialog.open(DetailsModalComponent, {
      data: {
        id: id,
        name: name,
        date: date,
        address: address,
        livreur: livreur,
      }
    });
  }

  commandAction(type:string = 'null'): void {
    if (type === 'null') { return; }
    else if (type === 'AddCommand') {
      this.dialog.open(AddCommandModalComponent);
    }
    else if (type === 'EditCommand') {
      this.dialog.open(EditCommandModalComponent);
    }
    else if (type === 'DeleteCommand') {
      this.dialog.open(DeleteCommandModalComponent);
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
  selector: 'add-command-modal.component',
  templateUrl: './add-command-modal.component.html',
  styleUrls: ['./add-command-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf, MatButtonModule, MatDialogModule, MatDatepickerModule],
})

export class AddCommandModalComponent {
  requiredValue = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  name: string = '';
  date: string = '';
  address: string = '';

  constructor(private CommandsService: CommandsService) { }

  createOrder = async () => {
    let dateFormated = this.date + "T00:00:00.000Z";
    let data: any = await this.CommandsService.createOrder(this.name, dateFormated, this.address)
    .catch((error: any) => {
        console.log(error)
    })
  }
}

@Component({
  selector: 'delete-command-modal.component',
  templateUrl: './delete-command-modal.component.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
})

export class DeleteCommandModalComponent { }

@Component({
  selector: 'edit-command-modal.component',
  templateUrl: './edit-command-modal.component.html',
  styleUrls: ['./edit-command-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
})

export class EditCommandModalComponent { }