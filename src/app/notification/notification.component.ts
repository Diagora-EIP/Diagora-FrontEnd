import { Component, Type } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationShowModalComponent } from './notification-show-modal/notification-show-modal.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
    SHOWNOTIFICATION: {
      component: NotificationShowModalComponent,
      constructor: () => {
        return {
          notification: this.selectedNotification,
        };
      },
      action: function (instance: any): void {
        throw new Error('Function not implemented.');
      }
    },
};
  notificationList: any = [];
  loading: boolean = true;
  displayedColumns = ['Name', 'Type', 'Logged At', 'Show'];
  selectedNotification: any = null;
  searchValue: string = '';
  tmpNotificationList: any = [];
  selectedValue = [];

  constructor(private notificationService: NotificationService, public dialog: MatDialog, ) {
    this.notificationService.getNotification().subscribe((data) => {
      console.log(data);
      this.notificationList = data;
      this.notificationList.sort((a: any, b: any) => {
        return new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime();
      });
      console.log(this.notificationList);
      // set logged_at to a date format for display 
      this.notificationList.forEach((element: any) => {
        element.logged_at = new Date(element.logged_at).toLocaleString();
      });
      this.tmpNotificationList = this.notificationList;
      this.loading = false
    });
   }

  openModal(modalType: string): void {
    const { component, constructor, action } = this.modalComponentMapping[modalType.toUpperCase()];

    if (!component) {
        throw new Error(`Type de modal non pris en charge : ${modalType}`);
    }

    const dialogRef = this.dialog.open(component, {
        panelClass: 'custom',
        data: constructor()
    });

    dialogRef.afterClosed().subscribe((data) => {
        if (!data)
            return
        action(data);
    });
  }

  showNotification(notification: any) {
    this.selectedNotification = notification;
    this.openModal('SHOWNOTIFICATION');
  }

  applyFilter(event: any, filter: boolean): void {
    if (!filter) {
      this.searchValue = event.target.value
    }
    this.notificationList = this.tmpNotificationList
    if (this.searchValue != '') {
      this.notificationList = this.notificationList.filter((notification: any) => {
        return (notification.entity_name.toLowerCase().includes(this.searchValue.toLowerCase()) || notification.log_type.toLowerCase().includes(this.searchValue.toLowerCase()) || notification.logged_at.toLowerCase().includes(this.searchValue.toLowerCase())) && notification.log_type.toLowerCase().includes(this.selectedValue.toString().toLowerCase());
      });
    } else {
      this.notificationList = this.notificationList.filter((notification: any) => {
        return notification.log_type.toLowerCase().includes(this.selectedValue.toString().toLowerCase());
      });
    }
  }

  filter(){
    this.applyFilter('', true);
  }
}
