import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';

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

    constructor(private router: Router, 
                private securityService: SecurityService, 
                private utilsService: UtilsService, 
                private fb: FormBuilder,
                private snackBarService: SnackbarService) { 
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

    async register() {
        if (this.registerGroup.invalid) {
            this.snackBarService.warningSnackBar('Veuillez remplir tous les champs correctement.');
            return;
        }
        
        const { name, address, company, email, password, passwordConf } = this.registerGroup.value;
        
        if (password != passwordConf) {
            this.snackBarService.warningSnackBar('Les mots de passe ne correspondent pas');
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
                    this.snackBarService.successSnackBar('Votre compte a été créé avec succès');
                },
                error: (err) => {
                    this.snackBarService.warningSnackBar(err.error.message);
                    console.log(err);
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
