import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environment';
import { PermissionsService } from '../services/permissions.service';
import { ManagerService } from '../services/manager.service';

// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logout1!: boolean;
  entreprise!: string;
  constructor(private router: Router, private managerService: ManagerService, public permissionsService: PermissionsService) { 
    // this.getPermissions();
    if (this.permissionsService.hasPermission('manager') == true) {
      this.getManagerEntreprise();
    }
  }

  getManagerEntreprise() {
    this.managerService.getManagerEntreprise().subscribe(
        (res) => {
            console.log("entreprise", res);
            this.entreprise = res.name;
            localStorage.setItem('entreprise', this.entreprise);
            localStorage.setItem('entrepriseId', res.company_id);
            localStorage.setItem('addressEntreprise', res.address);
            const users = JSON.stringify(res.users);
            localStorage.setItem('users', users);
        },
        (err) => {
            console.log(err);
        }
    );
  }

  hasPermission(permission: string): boolean {
    if (localStorage.getItem('token') === null) {
      return false;
    }
    return this.permissionsService.hasPermission(permission);
  }

  ngOnInit(): void {
    this.logout1 = false;
  }

  goto(params: string) {
    this.router.navigate([params]);
  }

  logout() {
    this.logout1 = true;
    // localStorage.removeItem('token');
    // this.router.navigate(['login']);
  }

  cancel() {
    this.logout1 = false;
  }

  confirm() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
