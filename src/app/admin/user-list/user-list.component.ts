import { Component, Type } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateModalComponent } from '../user-create-modal/user-create-modal.component';
import { CompanyCreateModalComponent } from '../company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from '../company-update-modal/company-update-modal.component';
import { Subscription, tap, throwError } from 'rxjs';
import { Roles } from 'src/app/models/Roles.dto';

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
    companyList: any = []
    RolesList: any = []
    private _entrepriseFilter: string = '';
    getUsersSubscription: Subscription | undefined;
    getCompanySubscription: Subscription | undefined;
    getRolesSubscription: Subscription | undefined;

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
        this.getCompany();
        this.getRoles();
    }

    ngOnDestroy() {
        this.getUsersSubscription?.unsubscribe();
        this.getCompanySubscription?.unsubscribe();
        this.getRolesSubscription?.unsubscribe();
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
        const users_id = this.companyList.filter((entreprise: any) => entreprise.company_id === user.company_id)[0].users_id
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
            const entrepriseToUpdate = this.companyList.find((entreprise: any) => entreprise.company_id === user.company_id);
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
        this.getUsersSubscription = this.adminService.newgetUsers()
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
                    this.userList = data.map((user: any) => {
                        return {
                            id: user.user_id ? user.user_id : '',
                            utilisateur: user.name ? user.name : '',
                            email: user.email ? user.email : '',
                            roles: user.roles ? this.getRolesId(user.roles) : '',
                            company_id: user.company ? user.company.company_id : 0,
                        }
                    });
                }
            });

        // this.userList = [{
        //     id: 1,
        //     entreprise: "test",
        //     utilisateur: "test",
        //     email: "test",
        //     roles: "test",
        //     company_id: 1
        // }]
    }

    getRolesId = (roles: Roles[]) => {
        const roles_id = roles.map((role: any) => {
            return role.role_id
        })
        return roles_id;
    }

    getRoles = async () => {
        this.getRolesSubscription = this.adminService.getRoles()
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
                    this.RolesList = data
                }
            });
    }

    getUserRoles = (roles_id: number[]) => {
        if (roles_id === null)
            return "No Roles"

        const roles = this.RolesList.filter((role: any) => roles_id.includes(role.role_id))

        if (roles)
            return roles.map((role: any) => role.name).join(', ')

        return "No Roles"
    }

    getCompany = async () => {
        this.getCompanySubscription = this.adminService.getAllCompany()
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
                    this.companyList = data.map((company: any) => {
                        return {
                            company_id: company.company_id,
                            company_name: company.name,
                            company_address: company.address,
                        }
                    })
                }
            });
    }

    getUserCompany = (company_id: number) => {
        if (company_id === null || company_id === 0)
            return "No Company"

        const company = this.companyList.find((company: any) => company.company_id === company_id)

        if (company)
            return company.company_name

        return "No Company"
    }
}
