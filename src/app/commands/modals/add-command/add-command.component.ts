import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommandsService } from 'src/app/services/commands.service';

@Component({
    selector: 'app-add-command',
    templateUrl: './add-command.component.html',
    styleUrls: ['./add-command.component.scss']
})
export class AddCommandComponent {
    description: string = ''
    address: string = ''
    date: string = ''

    constructor(public dialogRef: MatDialogRef<AddCommandComponent>, private commandService: CommandsService) { }

    close(): void {
        this.dialogRef.close();
    }

    dataCheck() {
        if (this.description.length == 0)
            return false
        if (this.address.length == 0)
            return false
        if (this.date.length == 0)
            return false
        return true
    }

    addCommand = async () => {
        if (!this.dataCheck()) { return }
        let dateFormated: string = this.date + "T00:00:00.000Z";
        let data: any = await this.commandService.createOrder(this.description, dateFormated, this.address)
            .then((response: any) => {
                this.dialogRef.close();
            })
            .catch((error: any) => {
                console.log(error)
            })
    }
}
