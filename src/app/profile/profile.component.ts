import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from '../services/security.service';
import { UserService } from '../services/user.service';
import { ManagerService } from '../services/manager.service';
import { PermissionsService } from '../services/permissions.service';

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

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private securityService: SecurityService,
        private userService: UserService,
        private managerService: ManagerService,
        public permissionsService: PermissionsService
    ) {
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
        this.entrepriseForm = this.fb.group({
            name: [localStorage.getItem('entreprise'), [Validators.required]],
            address: [
                localStorage.getItem('addressEntreprise'),
                [Validators.required],
            ],
        });
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

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('remember');
        localStorage.removeItem('name');
        localStorage.removeItem('entreprise');
        localStorage.removeItem('addressEntreprise');
        localStorage.removeItem('users');
        localStorage.removeItem('addressId');
        this.permissionsService.deleteUserPermissions();
        this.router.navigate(['/login']);
    }
}
