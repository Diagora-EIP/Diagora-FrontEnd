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
  tokenReset!: string;
  employe!: any[];
  tmpIndex!: number;
  selected!: string;
  tmpValue!: string;
  constructor(private router: Router) { 
    this.getUserInfo();
  }


  ngOnInit(): void {
    this.logout1 = false;
    this.modal = false;
    this.name = '';
    this.nameEntreprise = 'Diagora';
    this.placeEntreprise = 'directeur';
    this.employe = [
      {name: 'Jean', place: 'directeur'},
      {name: 'Pierre', place: 'livreur'},
      {name: 'William', place: 'admin'},
      {name: 'Jack', place: 'emplyer'},
    ]
    this.tmpIndex = 0;
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

  mdpValue(value: string) {
    this.password = value;
  }


  mdpValueConf(value: string) {  
    this.confirmPassword = value;
  }


  async getUserInfo() {
    const id = localStorage.getItem('id');
    console.log("id", id);
    await fetch("http://20.111.8.106:3000/user/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
    }).then(function (response) {
      return response.json();
    }).then(data => {
      console.log("data", data);
      this.name = data.user.name;
    }).catch((error) => {
      console.log(error);
    });
  }


  async changeMdp() {
    if (this.password == undefined || this.confirmPassword == undefined) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    console.log(this.password, this.confirmPassword)
    if (this.password != this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // const id = localStorage.getItem('id');
    // console.log("id", parseInt(id));
    const body = {
      "user_id": 31,
      "password": this.password,
    };
    console.log("body", body);
    //Requête pour se connecter
    await fetch("http://20.111.8.106:3000/user/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      return response.json();
    }).then(data => {
      console.log("data", data);
      if (data.statusCode == 200) {
        alert('Mot de passe changé avec succès');
        this.password = "";
        this.confirmPassword = "";
      }
      else {
        alert('Erreur lors du changement de mot de passe');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  selection(name: string) {
    this.tmpValue = name;
  }
  validation() {
    if (this.tmpValue == "------" || this.tmpValue == undefined) {
      alert('Veuillez choisir un grade');
      return
    }
    this.employe[this.tmpIndex].place = this.tmpValue;
    this.modal = false;
  }

}
