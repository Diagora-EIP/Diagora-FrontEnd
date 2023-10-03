import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateModalComponent } from '../user-create-modal/user-create-modal.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {

    constructor(private adminService: AdminService, public dialog: MatDialog) {
        this.getUsers();
    }
    displayedColumns = ['entreprise', 'utilisateur', 'email', 'roles'];

    dataSource: any = []
    entrepriseList: any = []
    private _entrepriseFilter: string = '';
    get entrepriseFilter(): string {
        return this._entrepriseFilter;
    }
    set entrepriseFilter(value: string) {
        this._entrepriseFilter = value;

        this.updateDataSource();
    }

    private _userList: any[] = [];
    get userList(): any[] {
        return this._userList;
    }
    set userList(value: any[]) {
        this._userList = value;

        this.updateDataSource();
    }

    openModal(): void {
        const dialogRef = this.dialog.open(UserCreateModalComponent, {
            panelClass: "custom",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal est fermée.', result);
        });
    }

    updateDataSource() {
        let users = this.userList

        if (this.entrepriseFilter && this.entrepriseFilter.length > 0) {
            users = users.filter((user: any) => user.entreprise.toLowerCase().startsWith(this.entrepriseFilter.toLowerCase()))
        }

        this.dataSource = users
    }

    getUsers = async () => {
        let data: any = await this.adminService.getUsers()
            .then((response: any) => {
                return response.users;
            })
            .catch((error: any) => {
                console.error("error", error)
            });

        const users = data.map((user: any) => {
            return {
                id: user.user_id ? user.user_id : '',
                entreprise: user.entreprise ? user.entreprise : '',
                utilisateur: user.name ? user.name : '',
                email: user.email ? user.email : '',
                roles: user.roles ? user.roles : '',
            }
        })

        this.userList = users;
        this.getUserEntreprise();
        this.getUserRoles();
    }

    getUserRoles = async () => {
        this.userList.forEach(async (user: any) => {
            const roles: any = await this.adminService.getRoles(user.id)
                .then((response: any) => {
                    let perm = []
                    if (response.isAdmin === true)
                        perm.push('Admin')
                    if (response.isUser === true)
                        perm.push('User')
                    return perm;
                })
                .catch((error: any) => {
                    console.error("error", error)
                    return "Old Account without rôles";
                });
            user.roles = roles;
        })
    }

    getUserEntreprise = async () => {
        this.entrepriseList = await this.adminService.getEntreprises()
            .then((response: any) => {
                return response;
            })
            .catch((error: any) => {
                console.error("error", error)
            });
        this.entrepriseList.forEach((entreprise: any) => {
            entreprise.users_ids.forEach((user_id: any) => {
                const user = this.userList.find((user: any) => user.id === user_id)
                if (user) {
                    user.entreprise = entreprise.name
                }
            })
        })
    }
}
