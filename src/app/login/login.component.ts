import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs/operators';
import { Subscription, throwError, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from '../services/permissions.service';

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

    constructor(private router: Router, private securityService: SecurityService, private utilsService: UtilsService, private fb: FormBuilder, private permissionsService: PermissionsService) {
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
            this.Erreur = 'Veuillez vérifier vos identifiants';
            this.popUp = true;
            this.loginForm.controls['password'].setErrors({ 'loginFailed': true });
            this.loginForm.controls['email'].setErrors({ 'loginFailed': true });
            return;
        }
    }

    // savePermissions() {
    //     let permissions: string[] = [];
    //     this.permissionsService.getPermissions().subscribe({
    //         next: (data) => {
    //             for (let i = 0; i < data.length; i++) {
    //                 permissions.push(data[i].name);
    //             }
    //             console.log("PERMISSIONS ", permissions);
    //             this.permissionsService.setUserPermissions(permissions);
    //             console.log("PERMISSIONS 2", this.permissionsService.userPermissions);
    //         }
    //     });
    // }

    async login() {
        if (this.loginForm.invalid) {
            this.Erreur = 'Veuillez remplir tous les champs correctement.';
            this.popUp = true;
            return;
        }

        const { email, password, remember } = this.loginForm.value;

        if (!this.utilsService.checkEmail(email)) {
            this.Erreur = 'Veuillez entrer une adresse mail valide';
            this.popUp = true;
            return;
        }

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
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.router.navigate(['home']);
                }
            });

    }

    // async login() {
    //     if (this.loginForm.invalid) {
    //         this.Erreur = 'Veuillez remplir tous les champs correctement.';
    //         this.popUp = true;
    //         return;
    //     }

    //     const { email, password, remember } = this.loginForm.value;

    //     if (!this.utilsService.checkEmail(email)) {
    //         this.Erreur = 'Veuillez entrer une adresse mail valide';
    //         this.popUp = true;
    //         return;
    //     }

    //     try {
    //         const data = await lastValueFrom(this.securityService.login(email, password, remember));

    //         localStorage.setItem('token', data.token);
    //         localStorage.setItem('id', data.user_id);
    //         localStorage.setItem('email', data.email);
    //         localStorage.setItem('name', data.name);

    //         if (remember) {
    //             localStorage.setItem('remember', 'true');
    //         } else {
    //             localStorage.setItem('remember', 'false');
    //         }

    //         this.permissionsService.forceRefreshPermissions();

    //         this.router.navigate(['home']);
    //     } catch (err) {
    //         let errorMessage = 'Une erreur est survenue';
    //         this.loginRequest(err);
    //         console.error(err);
            
    //     }
    // }
}
