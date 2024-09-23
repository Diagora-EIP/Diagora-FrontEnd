import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NavbarComponent implements OnInit {
  isMenuOpen: boolean = false;

  constructor(public permissionsService: PermissionsService, private cdr: ChangeDetectorRef, private snackBarService: SnackbarService) {
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
  logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('remember');
        localStorage.removeItem('name');
        localStorage.removeItem('entreprise');
        localStorage.removeItem('addressEntreprise');
        localStorage.removeItem('users');
        localStorage.removeItem('addressId');
        localStorage.removeItem('entrepriseId');
        this.permissionsService.deleteUserPermissions();
        this.snackBarService.successSnackBar('Vous avez été déconnecté avec succès');
    }
}
