import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name!: string;
  password!: string;
  passwordConf!: string;
  popUp!: boolean;
  Erreur!: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.popUp = false;
    this.name = ""
    this.password = ""
  }

  closePopUp() {
    this.popUp = false;
  }

  onEnterEmail(value : string) {
    console.log(value)
    this.name = value
  }

  onEnterPass(value: string) {
    this.password = value
  }

  onEnterPassConf(value: string) {
    this.passwordConf = value
  }

  async login() {
    if (this.name == "" || this.password == "" || this.passwordConf == "") {
      this.Erreur = 'Veuillez remplir tous les champs';
      this.popUp = true;
      return;
    }

    if (this.password != this.passwordConf) {
      this.Erreur = "Les mots de passe ne sont pas identique"
      this.popUp = true;
      return;
    }
  }
}
