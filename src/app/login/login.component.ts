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
    //initialisation de toute les variable
    ngOnInit() {
        this.popUp = false;
        this.name = "";
        this.password = "";
        this.remember = false;
    }
    //Fonction qui permet de fermer la pop up
    closePopUp() {
        this.popUp = false;
    }
    //Fonction qui permet de changer la valeur de la variable remember
    onRem() {
        this.remember = !this.remember
    }
    //Fonction qui permet de se connecter
    async login() {
        if (this.name == "" || this.password == "") {
            this.Erreur = 'Veuillez remplir tous les champs';
            this.popUp = true;
            return;
        }
        //Regex pour vérifier que l'adresse mail est valide
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
        //Requête pour se connecter
        await fetch("http://20.111.8.106:3000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }).then(function (response) {
            return response.json();
        }).then(data => {
            //Si la requête est un succès, on redirige vers la page d'accueil et on stock le token dans le local storage
            if (data.statusCode == 201) {
                this.router.navigate(['home']);
                localStorage.setItem('token', data.token)
                localStorage.setItem('id', data.user.user_id)
                localStorage.setItem('email', data.user.email)
                if (!this.remember)
                    localStorage.setItem('remember', "true")
                else
                    localStorage.setItem('remember', "false")
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
