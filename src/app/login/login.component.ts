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

  async login() {
    if (this.name == "" || this.password == "") {
      this.Erreur = 'Veuillez remplir tous les champs';
      this.popUp = true;
      return;
    }
    await fetch("http://localhost:3000/user/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.name,
        // email: "william@epitech.eu",
        password: this.password,
        // password: "william",
      }),
    }).then(function (response) {
      // The API call was successful!
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(data => {
      // This is the JSON from our response
      this.router.navigate(['home']);
      localStorage.setItem('token', data.token)
      localStorage.setItem('id', data.user.user_id)
    })
}
}
