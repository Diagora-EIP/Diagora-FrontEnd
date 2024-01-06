import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public permissionsService: PermissionsService, private cdr: ChangeDetectorRef) {
    changeDetection: ChangeDetectionStrategy.Default
  }

  ngOnInit() {
    this.permissionsService.userPermissions.subscribe((permissions) => {
        this.cdr.detectChanges();
    });
  }

  checkPermission(permission: string): boolean {
    if (localStorage.getItem('token') === null) {
      return false;
    }
    return this.permissionsService.hasPermission(permission);
  }
}