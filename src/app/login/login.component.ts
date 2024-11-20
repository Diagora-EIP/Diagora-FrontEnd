import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from '../services/permissions.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    loginForm: FormGroup;
    Erreur: string = "";
    popUp: boolean = false;
    loginSubscription: Subscription | undefined;

    constructor(private router: Router, 
                private securityService: SecurityService, 
                private utilsService: UtilsService, 
                private fb: FormBuilder, 
                private permissionsService: PermissionsService,
                private snackBarService: SnackbarService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            remember: [false],
        });
    }

    ngOnDestroy() {
        this.loginSubscription?.unsubscribe();
    }

    closePopUp() {
        this.popUp = false;
    }

    loginRequest(data: any) {
        if (data.status === 401) {
            this.snackBarService.warningSnackBar('Veuillez vérifier vos identifiants');
            this.popUp = true;
            this.loginForm.controls['password'].setErrors({ 'loginFailed': true });
            this.loginForm.controls['email'].setErrors({ 'loginFailed': true });
            this.loginForm.controls['email'].setValue('')
            this.loginForm.controls['password'].setValue('')
            this.loginForm.controls['remember'].setValue(false)
            return;
        }
    }

    async login() {
        if (this.loginForm.invalid) {
            this.snackBarService.warningSnackBar('Veuillez remplir tous les champs correctement.');
            this.popUp = true;
            // this.loginForm.value.email = ''
            // this.loginForm.value.password = ''
            // this.loginForm.value.remember = false
            return;
        }

        const { email, password, remember } = this.loginForm.value;

        if (!this.utilsService.checkEmail(email)) {
            this.snackBarService.warningSnackBar('Veuillez entrer une adresse mail valide');
            this.popUp = true;
            return;
        }
        this.permissionsService.deleteUserPermissions();

        this.loginSubscription = this.securityService.login(email, password, remember)
            .pipe(
                tap({
                    next: data => {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('id', data.user_id);
                        localStorage.setItem('email', data.email);
                        localStorage.setItem('name', data.name);
                        if (!remember) {
                            localStorage.setItem('remember', 'true');
                        } else {
                            localStorage.setItem('remember', 'false');
                        }
                        this.permissionsService.forceRefreshPermissions();
                    },
                    error: (err) => {
                        let errorMessage = 'Une erreur est survenue';
                        this.loginRequest(err);
                        this.loginForm.value.email = ''
                        this.loginForm.value.password = ''
                        this.loginForm.value.remember = false
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.snackBarService.successSnackBar('Vous êtes connecté !');
                    this.router.navigate(['home']);
                }
            });

    }
}
