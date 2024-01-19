import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { CommandsService } from '../../../services/commands.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-delete-command',
    templateUrl: './delete-command.component.html',
    styleUrls: ['./delete-command.component.scss']
})
export class DeleteCommandComponent {

    constructor(@Inject(MAT_DIALOG_DATA) 
                public data: any, 
                public dialogRef: MatDialogRef<DeleteCommandComponent>, 
                private commandService: CommandsService,
                private snackBarService: SnackbarService) { }

    close(): void {
        this.dialogRef.close();
    }

    deleteCommand = async () => {
        this.commandService.deleteOrder(this.data.schedule_id)
            .pipe(
                tap({
                    next: data => {
                        this.snackBarService.successSnackBar('La commande a été supprimée avec succès !');
                        this.dialogRef.close();
                    },
                    error: error => {
                        console.log(error);
                        this.snackBarService.warningSnackBar('Erreur lors de la suppression de la commande !');
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }

}
