import { Component, OnInit, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public permissionsService: PermissionsService, private cdr: ChangeDetectorRef, private zone: NgZone) {
    changeDetection: ChangeDetectionStrategy.Default
  }

  ngOnInit() {
    this.permissionsService.userPermissions.subscribe((permissions) => {
        console.log('ICI', permissions);
        this.cdr.detectChanges();
    });
  }

  checkPermission(permission: string): boolean {
    if (localStorage.getItem('token') === null) {
      return false;
    }
    // console.log("Res", this.permissionsService.hasPermission(permission));
    // console.log("Res2", permission);
    // console.log("Res3", this.permissionsService.userPermissions);
    
    return this.permissionsService.hasPermission(permission);
  }
}