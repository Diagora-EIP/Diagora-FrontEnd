    import { Component, OnInit } from '@angular/core';
    import { ManagerService } from 'src/app/services/manager.service';
    import { MatDialog } from '@angular/material/dialog';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';


    @Component({
        selector: 'app-manager-user-list',
        templateUrl: './manager-user-list.component.html',
        styleUrls: ['./manager-user-list.component.scss'],
    })

    export class ManagerUserListComponent {
        displayedColumns = ['utilisateur', 'email', 'roles'];
        dataSource: any = [];
        popUp: boolean = false;
        newUserForm: FormGroup;
        updateUserForm: FormGroup;
        updateUserRole: any = [{
            name:"manager",
            checked: false
        }, {
            name:"user",
            checked: false
        }, {
            name:"admin",
            checked: false
        }];
        entreprise: string = ""
        modalUpdateUser: boolean = false;
        allRoles: any = [{
            name:"manager",
            checked: false
        }, {
            name:"user",
            checked: false
        }, {
            name:"admin",
            checked: false
        }];

        constructor(private managerService: ManagerService, public dialog: MatDialog,  private fb: FormBuilder, ) {
            this.newUserForm = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                name: ['', [Validators.required]],
            });
            this.updateUserForm = this.fb.group({
                name: ['', [Validators.required]],
                id: ['', [Validators.required]],
            });
            this.entreprise = localStorage.getItem('entreprise') || '';
            this.getManagerEntreprise();
        }
        
        getManagerEntreprise() {
            this.managerService.getManagerEntreprise().subscribe(
                (res) => {
                    console.log("entreprise", res.users);
                    const users = JSON.stringify(res.users);
                    localStorage.setItem('users', users);
                    this.dataSource = res.users;
                    this.updateCheckedRoles();
                },
                (err) => {
                    console.log(err);
                }
            );
        }
        
        updateCheckedRoles() {
            for (let i = 0; i < this.dataSource.length; i++) {
                this.managerService.getUserInformations(this.dataSource[i].user_id).subscribe(
                    (res) => {
                        console.log(res);
                        let role = [];
                        for (let j = 0; j < res.length; j++) {
                            role.push(res[j].name);
                        }
                        this.dataSource[i].roles = role;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        }

        openModalNewUser(): void {
            this.popUp = !this.popUp;
        }

        openModalUpdateUser(user: any): void {
            console.log(user);
            this.modalUpdateUser = !this.modalUpdateUser;
            this.updateUserForm.controls['name'].setValue(user.name);
            this.updateUserForm.controls['id'].setValue(user.user_id);
            for (let i = .0; i < this.updateUserRole.length; i++) {
                if (user.roles.includes(this.updateUserRole[i].name)) {
                    this.updateUserRole[i].checked = true;
                }
            }
        }

        updateUser() {
            const id = this.updateUserForm.value.id;
            const body = {
                name: this.updateUserForm.value.name,
            }
            console.log(id, body)
            this.managerService.updateUserInformations(id, body).subscribe(
                (res) => {
                    console.log(res);
                    this.modalUpdateUser = false;
                    window.location.reload();
                },
                (err) => {
                    console.log(err);
                }
            );
        }

        async addUser() {
            const roles = this.allRoles.filter((role: any) => role.checked === true).map((role: any) => role.name);
            const body = {
                email: this.newUserForm.value.email,
                name: this.newUserForm.value.name,
                roles: roles
            }
            this.managerService.newUserByManager(body).subscribe(
                (res) => {
                    console.log(res);
                    this.popUp = false;
                },
                (err) => {
                    console.log(err);
                }
            );
            window.location.reload();
        }

    }
