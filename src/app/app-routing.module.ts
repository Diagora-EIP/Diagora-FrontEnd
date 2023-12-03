import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
// import { notFoundComponent } from './not-found/not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { CarteComponent } from './carte/carte.component';
import { PlanningComponent } from './planning/planning.component';
import { CommandsComponent } from './commands/commands.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { VehiculeComponent } from './vehicule/vehicule.component';
import { StatisticComponent } from './statistic/statistic.component';
import { AuthGuard, AuthLeftGuard } from './guards/auth-guard.guard';
import { userGuard, adminGuard } from './guards/role-guard.guard';
import { ManagerUserListComponent } from './manager/manager-user-list/manager-user-list.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '', canActivate: [AuthLeftGuard], children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
        ]
    },
    {
        path: '', canActivate: [AuthGuard], children: [
            { path: 'carte/:date', component: CarteComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'home', component: HomeComponent },
            { path: 'planning', component: PlanningComponent },
            { path: 'commands', component: CommandsComponent },
            { path: 'vehicule', component: VehiculeComponent },
            { path: 'statistic', component: StatisticComponent },
            { path: 'manager/userList', component: ManagerUserListComponent },
        ]
    },
    {
        path: 'admin', canActivate: [adminGuard], children: [
            { path: 'userList', component: UserListComponent, },
        ]
    },
    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
