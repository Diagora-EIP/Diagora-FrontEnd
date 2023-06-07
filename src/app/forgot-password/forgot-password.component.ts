import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  name!: string;
  password!: string;
  confirmPassword!: string;
  popUp!: boolean;
  Erreur!: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.name = "";
    this.password = "";
    this.confirmPassword = "";
    this.popUp = false;
    this.Erreur = "";
  }

  closePopUp() {
    this.popUp = false;
  }

  onEnterEmail(value: string) {
    this.name = value
  }

  onEnterPass(value: string) {
    this.password = value
  }

  onEnterConfirmPass(value: string) {
    this.confirmPassword = value
  }

  update() {
    if (this.name == "" || this.password == "" || this.confirmPassword == "") {
      this.Erreur = 'Veuillez remplir tous les champs';
      this.popUp = true;
    }
    if (this.password != this.confirmPassword) {
      this.Erreur = 'Les mots de passe ne correspondent pas';
      this.popUp = true;
    }
  }
}
