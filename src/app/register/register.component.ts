import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerGroup: FormGroup;
    popUp!: boolean;
    Erreur!: string;
    registerSubscription: Subscription | undefined;

    constructor(private router: Router, private securityService: SecurityService, private utilsService: UtilsService, private fb: FormBuilder) { 
        this.registerGroup = this.fb.group({
            name: ['', [Validators.required]],
            address: ['', [Validators.required]],
            company: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            passwordConf: ['', [Validators.required]],
        });
    }
    ngOnDestroy() {
        this.registerSubscription?.unsubscribe();
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
        
        const { name, address, company, email, password, passwordConf } = this.registerGroup.value;
        
        if (password != passwordConf) {
            this.Erreur = "Les mots de passe ne sont pas identique"
            this.popUp = true;
            return;
        }

        const body = {
            "name": name,
            "email": email,
            "password": password,
            "company": company,
            "address": address,
        }

        
        this.registerSubscription = this.securityService.registerManager(body)
        .pipe(
            tap({
                next: data => {
                },
                error: (err) => {
                    console.log("err", err);
                    if (err.status == 409) {
                        this.Erreur = "l'entreprise existe déjà";
                        this.popUp = true;
                        this.registerGroup.reset();
                        return;
                    }
                    this.Erreur = err.error;
                    this.popUp = true;
                    this.registerGroup.reset();
                }
            })
        )
        .subscribe({
            next: (data) => {
                this.router.navigate(["/login"]);
            }
        });
    }
}
