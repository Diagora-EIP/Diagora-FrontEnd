import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { CarteComponent } from './carte/carte.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CommandsComponent } from './commands/commands.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { VehiculeComponent } from './vehicule/vehicule.component';
import { StatisticComponent } from './statistic/statistic.component';
import { AuthGuard, AuthLeftGuard } from './guards/role-guard.guard';
import { ManagerUserListComponent } from './manager/manager-user-list/manager-user-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerGestionClientComponent } from './manager/manager-gestion-client/manager-gestion-client.component';
import { ManagerToolsComponent } from './manager/manager-tools/manager-tools.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '', canActivate: [AuthLeftGuard], children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password/:id', component: ResetPasswordComponent },
        ]
    },
    {
        path: '', canActivate: [AuthGuard], children: [
            { path: 'carte', component: CarteComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'home', component: HomeComponent },
            { path: 'schedule', component: ScheduleComponent },
            { path: 'commands', component: CommandsComponent },
        ],
        data: {
            permission: ['user', 'admin']
        }
    },
    {
        path : '', canActivate: [AuthGuard], children: [
            { path: 'vehicule', component: VehiculeComponent },
            { path: 'manager', component: ManagerComponent },
            { path: 'manager/gestion-client', component: ManagerGestionClientComponent },
            { path: 'manager/userList', component: ManagerUserListComponent },
            { path: 'manager/tools', component: ManagerToolsComponent },
        ],
        data: {
            permission: ['manager', 'admin']
        }
    },
    {
        path: 'admin', canActivate: [AuthGuard], children: [
            { path: 'userList', component: UserListComponent, },
            { path: 'statistic', component: StatisticComponent },
        ],
        data: {
            permission: ['admin']
        }
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
