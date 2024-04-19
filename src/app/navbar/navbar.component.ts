import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;

  constructor(public permissionsService: PermissionsService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.permissionsService.userPermissions.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  checkPermission(permission: string): boolean {
    if (localStorage.getItem('token') === null) {
      return false;
    }
    return this.permissionsService.hasPermission(permission);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onMouseEnter() {
    console.log('Mouse entered');
    this.toggleMenu();
  }
  
  onMouseLeave() {
    console.log('Mouse left');
    this.toggleMenu();
  }
}
