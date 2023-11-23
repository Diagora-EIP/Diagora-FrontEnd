import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CommandsService } from 'src/app/services/commands.service';
import { AddCommandComponent } from './modals/add-command/add-command.component';
import { DetailsCommandComponent } from './modals/details-command/details-command.component';
import { EditCommandComponent } from './modals/edit-command/edit-command.component';
import { DeleteCommandComponent } from './modals/delete-command/delete-command.component';

const modalComponentMapping: { [key: string]: Type<any> } = {
    DETAILS: DetailsCommandComponent,
    ADD: AddCommandComponent,
    EDIT: EditCommandComponent,
    DELETE: DeleteCommandComponent,
};

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

    openModal(type: string = 'DETAILS'): void {
        const modalComponent: Type<any> = modalComponentMapping[type];
        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${type}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', type, 'est fermée.', result);
        });
    }

}

// @Component({
//   selector: 'details-modal.component',
//   templateUrl: './details-modal.component.html',
//   standalone: true,
//   imports: [MatDialogModule, MatButtonModule],
// })

// export class DetailsModalComponent {
//   constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
// }

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

// @Component({
//   selector: 'delete-command-modal.component',
//   templateUrl: './delete-command-modal.component.html',
//   standalone: true,
//   imports: [MatButtonModule, MatDialogModule, MatIconModule],
// })

// export class DeleteCommandModalComponent { }

// @Component({
//   selector: 'edit-command-modal.component',
//   templateUrl: './edit-command-modal.component.html',
//   styleUrls: ['./edit-command-modal.component.scss'],
//   standalone: true,
//   imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
// })

// export class EditCommandModalComponent { }