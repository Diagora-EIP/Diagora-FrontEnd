import { Component, Type } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ManagerUserUpdateModalComponent } from '../user-update-modal/user-update-modal.component';
import { ManagerUserCreateModalComponent } from '../user-create-modal/user-create-modal.component';
import { ManagerUserVehicleUpdateModalComponent } from '../user-vehicle-update-modal/user-vehicle-update-modal.component';
import { ConfirmModalService } from '../../confirm-modal/confirm-modal.service';
import { SnackbarService } from '../../services/snackbar.service';


@Component({
    selector: 'app-manager-user-list',
    templateUrl: './manager-user-list.component.html',
    styleUrls: ['./manager-user-list.component.scss'],
})

export class ManagerUserListComponent {
    modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
        USERCREATE: {
            component: ManagerUserCreateModalComponent,
            constructor: () => {
                return {
                    roles: this.rolesList,
                }
            },
            action: (instance: any) => this.addUser(instance)
        },
        USERUPDATE: {
            component: ManagerUserUpdateModalComponent,
            constructor: () => {
                return {
                    user: this.selectedUser,
                    rolesList: this.rolesList,
                }
            },
            action: (instance: any) => this.updateUserBis(instance)
        },
        USERVEHICLEUPDATE: {
            component: ManagerUserVehicleUpdateModalComponent,
            constructor: () => {
                return {
                    user: this.selectedUser,
                }
            },
            action: (instance: any) => this.updateUserBis(instance)
        },
    };
    displayedColumns = ['utilisateur', 'email', 'roles', 'settings'];
    userList: any = [];
    entreprise: string = ""
    modalUpdateUser: boolean = false;
    loading: boolean = false;
    rolesList: any = [];
    updateUserRole: any = [];
    selectedUser: any = null;
    vehicleList: any = [];

    constructor(private managerService: ManagerService,
        private userService: UserService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private confirmModalService: ConfirmModalService,
        private snackbarService: SnackbarService) {
        this.entreprise = localStorage.getItem('entreprise') || '';
        this.getRolesList();
        this.getManagerEntreprise();
    }

    openModal(modalType: string): void {
        const { component, constructor, action } = this.modalComponentMapping[modalType.toUpperCase()];

        if (!component) {
            throw new Error(`Type de modal non pris en charge : ${modalType}`);
        }

        const dialogRef = this.dialog.open(component, {
            panelClass: 'custom',
            data: constructor()
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (!data)
                return
            action(data);
        });
    }

    callUpdateUser = (user: any) => {
        this.selectedUser = user;
        this.openModal('USERUPDATE')
    }

    callDeleteUser = (user: any) => {
        this.selectedUser = user;
        this.confirmModalService.openConfirmModal('Voulez-vous vraiment supprimer cet employé ?').then((result) => {
            if (result) {
                this.managerService.deleteUser(user.user_id).subscribe({
                    next: () => {
                        this.deleteUser(true);
                        this.snackbarService.successSnackBar("L'employé a bien été supprimé.");
                    }
                });
            }
        });
    }

    callUpdateUserVehicle = (user: any) => {
        this.selectedUser = user;
        this.openModal('USERVEHICLEUPDATE')
    }

    getRolesList() {
        this.userService.getRolesList()
            .subscribe({
                next: (data) => {
                    this.rolesList = data;
                    this.updateUserRole = data;
                    // this.updateUserRole.forEach((role: any) => {
                    //     role.checked = false;
                    // })
                },
            });
    }

    getUserRoles = (roles: any) => {
        if (roles)
            return roles.map((role: any) => role.name).join(', ')

        return "No Roles"
    }

    getManagerEntreprise() {
        this.loading = true;
        this.managerService
            .getManagerEntreprise()
            .pipe(
                tap({
                    next: (data: any) => {
                        this.loading = false;
                        this.entreprise = data.name;
                        const users = JSON.stringify(data.users);
                        localStorage.setItem('users', users);
                        this.userList = data.users;
                        this.updateCheckedRoles();
                    },
                    error: (err) => {
                        this.loading = false;
                        console.error('Error fetching manager entreprise:', err);
                    },
                })
            )
            .subscribe();
    }

    updateCheckedRoles() {
        for (let i = 0; i < this.userList.length; i++) {
            this.managerService.getUserInformations(this.userList[i].user_id).subscribe(
                (res) => {
                    this.userList[i].roles = res;
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    updateUserBis(result: any) {
    }

    addUser = (user: any) => {
        const userFormat = {
            user_id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles.map((role_id: number) => this.rolesList.find((role: any) => role.role_id === role_id)),
        }
        this.userList = [...this.userList, userFormat];
    }

    deleteUser = (isDeleted: any) => {
        if (isDeleted)
            this.userList = [...this.userList.filter((user: any) => user.user_id !== this.selectedUser.user_id)]
    }

}
