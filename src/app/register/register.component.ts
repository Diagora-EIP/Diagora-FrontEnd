import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name!: string;
  email!: string;
  password!: string;
  passwordConf!: string;
  popUp!: boolean;
  Erreur!: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.popUp = false;
    this.name = ""
    this.password = ""
    this.passwordConf = ""
    this.email = ""
  }

  closePopUp() {
    this.popUp = false;
  }

  onEnterEmail(value : string) {
    this.email = value
  }

  onEnterPass(value: string) {
    this.password = value
  }

  onEnterPassConf(value: string) {
    this.passwordConf = value
  }

  onEnterName(value: string) {
    this.name = value
  }

  async register() {
    if (this.email == "" || this.password == "" || this.passwordConf == "" || this.name == "") {
      this.Erreur = 'Veuillez remplir tous les champs';
      this.popUp = true;
      return;
    }

    if (this.password != this.passwordConf) {
      this.Erreur = "Les mots de passe ne sont pas identique"
      this.popUp = true;
      return;
    }

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!this.email.match(validRegex)) {
      this.Erreur = 'Veuillez entrer une adresse mail valide';
      this.popUp = true;
      return;
    }

    const body = {
      "name": this.name,
      "email": this.email,
      "password": this.password
    }

    await fetch("http://20.111.8.106:3000/user/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(function(response) {
      console.log("res", response);
      return response.json();
    }).then(res => {
      console.log("res", res);
      if (res.error) {
        this.Erreur = res.error;
        this.popUp = true;
        this.name = "";
        this.password = "";
        this.passwordConf = "";
        this.email = "";
      } else {
        this.router.navigate(["/login"]);
      }
    })
  }
}
