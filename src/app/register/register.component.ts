import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerGroup: FormGroup;
    popUp!: boolean;
    Erreur!: string;

    constructor(private router: Router, private securityService: SecurityService, private utilsService: UtilsService, private fb: FormBuilder) { 
        this.registerGroup = this.fb.group({
            name: ['', [Validators.required]],
            firstname: ['', [Validators.required]],
            entreprise: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            passwordConf: ['', [Validators.required]],
        });
    }


    closePopUp() {
        this.Erreur = "";
        this.popUp = false;
    }

    async register() {
        if (this.registerGroup.invalid) {
            this.Erreur = 'Veuillez remplir tous les champs correctement.';
            this.popUp = true;
            return;
        }
        
        
        const { name, firstname, entreprise, email, password, passwordConf } = this.registerGroup.value;
        
        if (password != passwordConf) {
            this.Erreur = "Les mots de passe ne sont pas identique"
            this.popUp = true;
            return;
        }

        // if (!this.utilsService.checkEmail(email)) {
        //     this.Erreur = 'Veuillez entrer une adresse mail valide';
        //     this.popUp = true;
        //     return;
        // }
        // if (this.email == "" || this.password == "" || this.passwordConf == "" || this.name == "") {
        //     this.Erreur = 'Veuillez remplir tous les champs';
        //     this.popUp = true;
        //     return;
        // }

        // if (this.password != this.passwordConf) {
        //     this.Erreur = "Les mots de passe ne sont pas identique"
        //     this.popUp = true;
        //     return;
        // }

        // var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        // if (!this.email.match(validRegex)) {
        //     this.Erreur = 'Veuillez entrer une adresse mail valide';
        //     this.popUp = true;
        //     return;
        // }

        // const body = {
        //     "name": this.name,
        //     "email": this.email,
        //     "password": this.password
        // }

        // await fetch(environment.apiUrl + "/user/register", {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(body)
        // }).then(function (response) {
        //     console.log("res", response);
        //     return response.json();
        // }).then(res => {
        //     console.log("res", res);
        //     if (res.error) {
        //         this.Erreur = res.error;
        //         this.popUp = true;
        //         this.name = "";
        //         this.password = "";
        //         this.passwordConf = "";
        //         this.email = "";
        //     } else {
        //         this.router.navigate(["/login"]);
        //     }
        // })
    }
}
