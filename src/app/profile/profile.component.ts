import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../services/security.service';
import { UserService } from '../services/user.service';
import { ManagerService } from '../services/manager.service';
import { PermissionsService } from '../services/permissions.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
    userInformationFrom: FormGroup;
    formPassword: FormGroup;
    entrepriseForm: FormGroup;
    manager: boolean = false;
    users_company: any = [];
    selectedColor: string;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private securityService: SecurityService,
        private userService: UserService,
        private managerService: ManagerService,
        public permissionsService: PermissionsService,
        private snackBarService: SnackbarService
    ) {
        this.selectedColor = localStorage.getItem('color') || '#000000';
        this.userInformationFrom = this.fb.group({
            email: [
                localStorage.getItem('email'),
                [Validators.required, Validators.email],
            ],
            name: [localStorage.getItem('name'), [Validators.required]],
        });
        this.formPassword = this.fb.group({
            password: ['', [Validators.required]],
            passwordConfirm: ['', [Validators.required]],
        });
        let addressEntreprise = localStorage.getItem('addressEntreprise');
        if (addressEntreprise) {
            console.log(addressEntreprise); 
            const parts = addressEntreprise.split(/,?\s+/);

            // Extract the country
            const country = parts.slice(-1)[0];
            const cityParts = parts.slice(-3, -2)[0].split(' ');

            // Extract the postal code, city, and the street
            const postalCode = cityParts[0];
            const ville = cityParts.slice(1).join(' ');
            const number = parts[0];
            const rue = parts.slice(1, -3).join(' ');
            this.entrepriseForm = this.fb.group({
                name: [localStorage.getItem('entreprise'), [Validators.required]],
                number: [number, [Validators.required]],
                rue: [rue, [Validators.required]],
                ville: [ville, [Validators.required]],
                postalCode: [postalCode, [Validators.required]],
            });
        } else {
            this.entrepriseForm = this.fb.group({
                name: [localStorage.getItem('entreprise'), [Validators.required]],
                number: ['', [Validators.required]],
                rue: ['', [Validators.required]],
                ville: ['', [Validators.required]],
                postalCode: ['', [Validators.required]],
            });
        }
        this.getRoles();
    }

    getRoles() {
        this.users_company = localStorage.getItem('users');
        this.users_company = JSON.parse(this.users_company);
        this.manager = this.permissionsService.hasPermission('manager');
    }

    updateUserInformation() {
        const body = {
            email: this.userInformationFrom.value.email,
            name: this.userInformationFrom.value.name,
        };
        this.userService.updateUserInformations(body).subscribe(
            (res) => {
                console.log(res);
                localStorage.setItem('email', res.email);
                localStorage.setItem('name', res.name);
                this.snackBarService.successSnackBar('Vos informations ont été mises à jour avec succès');
            },
            (err) => {
                console.log(err);
            }
        );
    }

    updateMDP() {
        if (
            this.formPassword.value.password !=
            this.formPassword.value.passwordConfirm
        ) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        const body = {
            password: this.formPassword.value.password,
        };
        this.userService.updatePassword(body).subscribe(
            (res) => {
                console.log(res);
                this.snackBarService.successSnackBar('Votre mot de passe a été mis à jour avec succès');
                this.formPassword.reset();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    updateEntreprise() {
        this.managerService
            .updateEntreprise(this.entrepriseForm.value)
            .subscribe(
                (res) => {
                    console.log(res);
                    localStorage.setItem('entreprise', res.name);
                    localStorage.setItem('addressEntreprise', res.address);
                    window.location.reload();
                },
                (err) => {
                    console.log(err);
                }
            );
    }
    updateColor() {
        localStorage.setItem('color', this.selectedColor);
    }

    // logout() {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('id');
    //     localStorage.removeItem('email');
    //     localStorage.removeItem('remember');
    //     localStorage.removeItem('name');
    //     localStorage.removeItem('entreprise');
    //     localStorage.removeItem('addressEntreprise');
    //     localStorage.removeItem('users');
    //     localStorage.removeItem('addressId');
    //     localStorage.removeItem('entrepriseId');
    //     this.permissionsService.deleteUserPermissions();
    //     this.router.navigate(['/login']);
    //     this.snackBarService.successSnackBar('Vous avez été déconnecté avec succès');
    // }
}
