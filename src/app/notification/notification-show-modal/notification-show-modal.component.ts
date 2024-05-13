import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-show-modal',
  templateUrl: './notification-show-modal.component.html',
  styleUrls: ['./notification-show-modal.component.scss']
})
export class NotificationShowModalComponent {
  name: string = '';
  value: string = '';
  type: string = '';
  logged_at: string = '';
  type_value: string = '';

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<NotificationShowModalComponent>,
  ) {
      console.log('data', data)
      this.name = data.notification.entity_name;
      this.value = data.notification.fields[0].value;
      this.type_value = data.notification.fields[0].name;
      this.type = data.notification.log_type;
      this.logged_at = data.notification.logged_at;

      console.log('name', this.name, 'value', this.value, 'type', this.type, 'logged_at', this.logged_at);
  }

  close(): void {
    this.dialogRef.close();
  }

  
}
