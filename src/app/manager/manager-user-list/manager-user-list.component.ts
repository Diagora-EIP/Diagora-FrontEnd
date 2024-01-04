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
        dataLoad: boolean = true;
        newUserForm: FormGroup;
        entreprise: string = ""

        constructor(private managerService: ManagerService, public dialog: MatDialog,  private fb: FormBuilder, ) {
            this.newUserForm = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                name: ['', [Validators.required]],
                password: ['', [Validators.required]],
            });
            console.log('constructor');
            // this.getUserEntreprise();
        }
                
        

        getUserEntreprise() {
            this.managerService.getUserEntreprise(this.entreprise).subscribe(
                (res) => {
                    console.log(res);
                    this.dataSource = res;
                    this.dataLoad = true;
                },
                (err) => {
                    console.log(err);
                }
            );
        }

        openModalNewUser(): void {
            console.log('openModalNewUser');
            this.popUp = !this.popUp;

        }

        addUser() {
            console.log('addUser');
            this.managerService.newUserByManager(this.newUserForm.value).subscribe(
                (res) => {
                    console.log(res);
                    this.popUp = !this.popUp;
                },
                (err) => {
                    console.log(err);
                }
            );
        }

    }
