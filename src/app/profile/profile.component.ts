import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  logout1!: boolean;
  name!: string;
  nameEntreprise!: string;
  placeEntreprise!: string;
  password!: string;
  confirmPassword!: string;
  listEmployes!: any[];
  modal!: boolean;
  constructor(private router: Router) { }


  ngOnInit(): void {
    this.logout1 = false;
    this.modal = false;
    this.name = 'Mehdi';
    this.nameEntreprise = 'Groupe OCP';
    this.placeEntreprise = 'directeur';
  }
  goto(params: string) {
    this.router.navigate([params]);
  }
  gotoplan() {
    this.router.navigate(['planning']);
  }
  gotocomm() {
    this.router.navigate(['commands']);
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

  gotoHome() {
    this.router.navigate(['home']);
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
