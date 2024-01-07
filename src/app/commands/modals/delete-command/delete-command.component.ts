import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { CommandsService } from 'src/app/services/commands.service';

@Component({
    selector: 'app-delete-command',
    templateUrl: './delete-command.component.html',
    styleUrls: ['./delete-command.component.scss']
})
export class DeleteCommandComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteCommandComponent>, private commandService: CommandsService) { }

    close(): void {
        this.dialogRef.close();
    }

    deleteCommand = async () => {
        this.commandService.deleteOrder(this.data.schedule_id)
            .pipe(
                tap({
                    next: data => {
                        this.dialogRef.close();
                    },
                    error: error => {
                        console.log(error);
                        this.dialogRef.close();
                    }
                })
            ).subscribe();
    }

}
