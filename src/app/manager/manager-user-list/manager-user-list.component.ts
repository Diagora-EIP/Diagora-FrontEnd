import { Component, Type } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ManagerUserUpdateModalComponent } from '../user-update-modal/user-update-modal.component';
import { ManagerUserCreateModalComponent } from '../user-create-modal/user-create-modal.component';
import { ManagerUserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';
import { ManagerUserVehicleUpdateModalComponent } from '../user-vehicle-update-modal/user-vehicle-update-modal.component';


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
        USERDELETE: {
            component: ManagerUserDeleteModalComponent,
            constructor: () => {
                return {
                    user: this.selectedUser,
                }
            },
            action: (instance: any) => this.deleteUser(instance)
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
    newUserForm: FormGroup;
    updateUserForm: FormGroup;
    entreprise: string = ""
    modalUpdateUser: boolean = false;
    rolesList: any = [];
    updateUserRole: any = [];
    selectedUser: any = null;
    vehicleList: any = [];

    constructor(private managerService: ManagerService, private userService: UserService, public dialog: MatDialog, private fb: FormBuilder) {
        this.newUserForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
        });
        this.updateUserForm = this.fb.group({
            name: ['', [Validators.required]],
            id: ['', [Validators.required]],
        });
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
        this.openModal('USERDELETE')
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
        this.managerService.getManagerEntreprise().subscribe(
            (res) => {
                this.entreprise = res.name;
                const users = JSON.stringify(res.users);
                localStorage.setItem('users', users);
                this.userList = res.users;
                this.updateCheckedRoles();
            },
            (err) => {
                console.log(err);
            }
        );
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

    openModalUpdateUser(user: any): void {
        this.modalUpdateUser = !this.modalUpdateUser;
        this.updateUserForm.controls['name'].setValue(user.name);
        this.updateUserForm.controls['id'].setValue(user.user_id);
        for (let i = .0; i < this.updateUserRole.length; i++) {
            if (user.roles.includes(this.updateUserRole[i].name)) {
                this.updateUserRole[i].checked = true;
            }
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
