import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environment';
import { ManagerService } from 'src/app/services/manager.service';

// import jwt from 'jsonwebtoken';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logout1!: boolean;
  admin = true;
  entreprise!: string;
  constructor(private router: Router, private managerService: ManagerService) { 
    // this.getPermissions();
    if (this.admin = true) {
      this.getManagerEntreprise();
    }
  }

  getManagerEntreprise() {
    this.managerService.getManagerEntreprise().subscribe(
        (res) => {
            console.log(res);
            this.entreprise = res.company.name;
            localStorage.setItem('entreprise', this.entreprise);
        },
        (err) => {
            console.log(err);
        }
    );
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
