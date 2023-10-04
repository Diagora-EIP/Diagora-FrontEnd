import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    email: string = "";
    password: string = "";
    Erreur: string = "";
    popUp: boolean = false;
    remember: boolean = false;
    loginSubscription: Subscription | undefined;

    constructor(private router: Router, private securityService: SecurityService, private utilsService: UtilsService) { }

    ngOnDestroy() {
        this.loginSubscription?.unsubscribe();
    }

    closePopUp() {
        this.popUp = false;
    }

    //Fonction qui permet de changer la valeur de la variable remember
    onRem() {
        this.remember = !this.remember
    }

    async login() {
        if (this.email == "" || this.password == "") {
            this.Erreur = 'Veuillez remplir tous les champs';
            this.popUp = true;
            return;
        }
        if (!this.utilsService.checkEmail(this.email)) {
            this.Erreur = 'Veuillez entrer une adresse mail valide';
            this.popUp = true;
            return;
        }
        this.loginSubscription = this.securityService.login(this.email, this.password, this.remember)
            .pipe(
                tap({
                    next: data => {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('id', data.user.user_id);
                        localStorage.setItem('email', data.user.email);
                        if (!this.remember) {
                            localStorage.setItem('remember', 'true');
                        } else {
                            localStorage.setItem('remember', 'false');
                        }
                    },
                    error: (err) => {
                        let errorMessage = 'Une erreur est survenue';
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    }
                }),
            )
            .subscribe({
                next: (data) => {
                    this.router.navigate(['home']);
                }
            });
    }
}
