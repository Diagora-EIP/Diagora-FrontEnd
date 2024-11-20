import { Component, Type } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateModalComponent } from '../modals/user-create-modal/user-create-modal.component';
import { UserUpdateModalComponent } from '../modals/user-update-modal/user-update-modal.component';
import { CompanyCreateModalComponent } from '../modals/company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from '../modals/company-update-modal/company-update-modal.component';
import { Subscription, tap, throwError } from 'rxjs';
import { Roles } from 'src/app/models/Roles.dto';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})

export class UserListComponent {
    modalComponentMapping: { [key: string]: { component: Type<any>; constructor: () => any, action: (instance: any) => void } } = {
        USERCREATE: {
            component: UserCreateModalComponent,
            constructor: () => {
                return {
                    companyList: this.companyList,
                    roles: this.RolesList,
                }
            },
            action: (instance: any) => this.addUser(instance)
        },
        USERUPDATE: {
            component: UserUpdateModalComponent,
            constructor: () => {
                return {
                    user: this.selectedUser,
                    companyList: this.companyList,
                    roles: this.RolesList,
                }
            },
            action: (instance: any) => this.updateUser(instance)
        },
        COMPANYCREATE: { component: CompanyCreateModalComponent, constructor: () => { }, action: (instance: any) => this.addCompany(instance) },
        COMPANYUPDATE: {
            component: CompanyUpdateModalComponent, constructor: () => {
                return {
                    company: this.selectedCompany,
                }
            },
            action: (instance: any) => this.updateCompany(instance)
        },
    };
    displayedColumns = ['entreprise', 'utilisateur', 'email', 'roles'];
    dataSource: any = []
    companyList: any = []
    RolesList: any = []
    selectedCompany: any = null
    selectedUser: any = null
    loading: boolean = false;

    private _companyFilter: string = '';
    getUsersSubscription: Subscription | undefined;
    getCompanySubscription: Subscription | undefined;
    getRolesSubscription: Subscription | undefined;

    get companyFilter(): string {
        return this._companyFilter;
    }
    set companyFilter(value: string) {
        this._companyFilter = value;

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

    updateDataSource() {
        let users = this.userList

        if (this.companyFilter.trim() === '' || this.companyFilter === undefined) {
            this.dataSource = users
            return
        }

        const filtered_company = this.companyList.filter((company: any) => company.company_name.trim().toLowerCase().startsWith(this.companyFilter.trim().toLowerCase()))

        users = users.filter((user: any) => filtered_company.some((company: any) => company.company_id === user.company_id))

        this.dataSource = users
    }

    getUsers = async () => {
        this.loading = true;
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
                        this.loading = false;
                        return {
                            id: user.user_id ? user.user_id : '',
                            name: user.name ? user.name : '',
                            email: user.email ? user.email : '',
                            roles: user.roles ? this.getRolesId(user.roles) : '',
                            company_id: user.company ? user.company.company_id : 0,
                        }
                    });
                }
            });

        // this.userList = [{
        //     id: 1,
        //     company: "test",
        //     name: "test",
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

    callUpdateCompany = (company_id: number) => {
        this.selectedCompany = this.companyList.find((company: any) => company.company_id === company_id)
        this.openModal('COMPANYUPDATE')
    }

    callUpdateUser = (user: any) => {
        this.selectedUser = user;
        this.openModal('USERUPDATE')
    }

    addCompany = (company: any) => {
        company = {
            company_id: company.company_id,
            company_name: company.name,
            company_address: company.address,
        }
        this.companyList.push(company)
    }

    addUser = (user: any) => {
        this.userList.push(user)
        this.updateDataSource()
    }

    updateCompany = (companyUpdated: any) => {
        const companyToUpdate = this.companyList.find((company: any) => company.company_id === companyUpdated.company_id);
        if (companyToUpdate) {
            companyToUpdate.company_name = companyUpdated.name;
            companyToUpdate.company_address = companyUpdated.address;
        }
        this.updateDataSource();
        this.selectedCompany = null
    }

    updateUser = (userUpdated: any) => {
        this.updateDataSource();
        this.selectedUser = null
    }
}
