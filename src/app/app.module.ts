import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { CarteComponent } from './carte/carte.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CommandsComponent } from './commands/commands.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { VehiculeComponent } from './vehicule/vehicule.component';
import { StatisticComponent } from './statistic/statistic.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { UserCreateModalComponent } from './admin/user-create-modal/user-create-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ManagerUserListComponent } from './manager/manager-user-list/manager-user-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyCreateModalComponent } from './admin/company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from './admin/company-update-modal/company-update-modal.component';
import { UserUpdateModalComponent } from './admin/user-update-modal/user-update-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddCommandComponent } from './commands/modals/add-command/add-command.component';
import { DeleteCommandComponent } from './commands/modals/delete-command/delete-command.component';
import { EditCommandComponent } from './commands/modals/edit-command/edit-command.component';
import { DetailsCommandComponent } from './commands/modals/details-command/details-command.component';
import { DetailsVehiculeComponent } from './vehicule/modals/details-vehicule/details-vehicule.component';
import { AddVehiculeComponent } from './vehicule/modals/add-vehicule/add-vehicule.component';
import { DeleteVehiculeComponent } from './vehicule/modals/delete-vehicule/delete-vehicule.component';
import { EditVehiculeComponent } from './vehicule/modals/edit-vehicule/edit-vehicule.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ForgotPasswordComponent,
        RegisterComponent,
        CarteComponent,
        ScheduleComponent,
        CommandsComponent,
        ProfileComponent,
        UserListComponent,
        VehiculeComponent,
        StatisticComponent,
        UserCreateModalComponent,
        UserUpdateModalComponent,
        ManagerUserListComponent,
        ResetPasswordComponent,
        NavbarComponent,
        CompanyCreateModalComponent,
        CompanyUpdateModalComponent,
        AddCommandComponent,
        DeleteCommandComponent,
        EditCommandComponent,
        DetailsCommandComponent,
        DetailsVehiculeComponent,
        AddVehiculeComponent,
        DeleteVehiculeComponent,
        EditVehiculeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatTableModule,
        MatInputModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatTooltipModule,
        FullCalendarModule,
        MatDatepickerModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
