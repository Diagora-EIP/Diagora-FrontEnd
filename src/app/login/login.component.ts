import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  name!: string;
  password!: string;
  popUp!: boolean;
  Erreur!: string;
  remember!: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.popUp = false;
    this.name = "";
    this.password = "";
    this.remember = false;
  }

  closePopUp() {
    this.popUp = false;
  }

  onEnterEmail(value : string) {
    this.name = value
  }

  onEnterPass(value: string) {
    this.password = value
  }

  onRem() {
    this.remember = !this.remember
  }

  async login() {
    if (this.name == "" || this.password == "") {
      this.Erreur = 'Veuillez remplir tous les champs';
      this.popUp = true;
      return;
    }
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!this.name.match(validRegex)) {
      this.Erreur = 'Veuillez entrer une adresse mail valide';
      this.popUp = true;
      return;
    }
    const body = {
      "email": this.name,
      "remember": this.remember,
      "password": this.password
    }
    await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }).then(function (response) {
      console.log("test", response);
      return response.json();
    }).then(data => {
      console.log(data);
      if (data.statusCode == 201) {
        this.router.navigate(['home']);
        localStorage.setItem('token', data.token)
      } else if (data.statusCode == 404) {
        this.Erreur = data.error;
        this.popUp = true;
      } else if (data.statusCode == 400) {
        this.Erreur = data.message[0];
        this.popUp = true;
      }
    })
}
}
