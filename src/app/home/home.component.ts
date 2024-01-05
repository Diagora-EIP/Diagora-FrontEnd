import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environment';
import { PermissionsService } from '../services/permissions.service';

// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logout1!: boolean;
  // admin = false;
  constructor(private router: Router, private permissionsService: PermissionsService) { 
    // this.getPermissions();
    // this.permissionsService.getPermissions().subscribe({
    //   next: (data) => {
    //       console.log("DATA ", data);
    //       let permissions = [];
    //       for (let i = 0; i < data.length; i++) {
    //           permissions.push(data[i].name);
    //       }
    //       this.permissionsService.setUserPermissions(permissions);
    //       localStorage.setItem('permissions', JSON.stringify(permissions));
    //   }
    // });
  }
  
  // async getPermissions() {
  //   let userId = localStorage.getItem('id');
  //   await fetch(environment.apiUrl + '/userRoles', {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + localStorage.getItem('token')
  //     },
  //   }) .then(function (response) {
  //     return response.json();
  //   }).then((data) => {
  //     data.forEach((element: any) => {
  //       if (element.name == "admin") {
  //         this.admin = true;
  //       }
  //     });
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

  hasPermission(permission: string): boolean {
    if (localStorage.getItem('token') === null) {
      return false;
    }
    // let permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    // let res = Object.values(permissions);
    let res2 = this.permissionsService.hasPermission(permission);
    // console.log("RES ", res);
    // console.log("RES2 ", res2);
    return res2;
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
