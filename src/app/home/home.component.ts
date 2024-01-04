import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environment';

// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logout1!: boolean;
  admin = false;
  constructor(private router: Router) { 
    this.getPermissions();
  }
  
  async getPermissions() {
    let userId = localStorage.getItem('id');
    await fetch(environment.apiUrl + '/userRoles', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
    }) .then(function (response) {
      return response.json();
    }).then((data) => {
      console.log(data);
      data.forEach((element: any) => {
        if (element.name == "admin") {
          this.admin = true;
        }
      });
    }).catch((error) => {
      console.log(error);
    });
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
