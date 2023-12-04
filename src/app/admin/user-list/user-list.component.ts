import { Component, Type } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateModalComponent } from '../user-create-modal/user-create-modal.component';
import { CompanyCreateModalComponent } from '../company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from '../company-update-modal/company-update-modal.component';
import { Subscription, tap, throwError } from 'rxjs';

const modalComponentMapping: { [key: string]: Type<any> } = {
    USERCREATE: UserCreateModalComponent,
    COMPANYCREATE: CompanyCreateModalComponent,
};

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent {

    displayedColumns = ['entreprise', 'utilisateur', 'email', 'roles'];

    dataSource: any = []
    entrepriseList: any = []
    private _entrepriseFilter: string = '';
    getCompanySubscription: Subscription | undefined;

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

    constructor(private adminService: AdminService, public dialog: MatDialog) {
        this.getUsers();
    }

    ngOnDestroy() {
        this.getCompanySubscription?.unsubscribe();
    }

    openModal(modalType: string): void {
        const modalComponent: Type<any> = modalComponentMapping[modalType.toUpperCase()];

        if (!modalComponent) {
            throw new Error(`Type de modal non pris en charge : ${modalType}`);
        }

        const dialogRef = this.dialog.open(modalComponent, {
            panelClass: 'custom',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('La modal', modalType, 'est fermée.', result);
        });
    }

    openModalUpdateCompany(user: any): void {
        const users_id = this.entrepriseList.filter((entreprise: any) => entreprise.company_id === user.company_id)[0].users_id
        const dataToSend = {
            company_id: user.company_id,
            company_name: user.entreprise,
            users_id: users_id
        };

        const dialogRef = this.dialog.open(CompanyUpdateModalComponent, {
            panelClass: 'custom',
            data: dataToSend
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result || !result.company_name)
                return
            const entrepriseToUpdate = this.entrepriseList.find((entreprise: any) => entreprise.company_id === user.company_id);
            if (entrepriseToUpdate) {
                entrepriseToUpdate.company_name = result.company_name;

                this.userList.forEach((user: any) => {
                    if (user.company_id === entrepriseToUpdate.company_id) {
                        user.entreprise = result.company_name;
                    }
                });
            }
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
                company_id: user.company_id ? user.company_id : '',
            }
        })

        // this.userList = [{
        //     id: 1,
        //     entreprise: "test",
        //     utilisateur: "test",
        //     email: "test",
        //     roles: "test",
        //     company_id: 1
        // }]
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
        this.getCompanySubscription = this.adminService.getCompany()
            .pipe(
                tap({
                    error: (err) => {
                        if (err.status === 409) {
                            return;
                        }
                        return throwError(() => new Error(err.error?.error || 'Une erreur est survenue'));
                    },
                }),
            )
            .subscribe({
                next: (data) => {
                    this.entrepriseList = data.map((company: any) => {
                        return {
                            company_id: company.company_id,
                            company_name: company.name,
                            users_id: []
                        }
                    })
                    this.userList.forEach((user: any) => {
                        this.entrepriseList.forEach((entreprise: any) => {
                            if (user.company_id == entreprise.company_id) {
                                user.entreprise = entreprise.company_name
                                entreprise.users_id.push(user.id)
                            }
                        })
                    })

                }
            });
    }
}
