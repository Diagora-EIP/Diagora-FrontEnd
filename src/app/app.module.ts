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
import { PlanningComponent } from './planning/planning.component';
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
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { UserCreateModalComponent } from './admin/user-create-modal/user-create-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ManagerUserListComponent } from './manager/manager-user-list/manager-user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyCreateModalComponent } from './admin/company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from './admin/company-update-modal/company-update-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ForgotPasswordComponent,
        RegisterComponent,
        CarteComponent,
        PlanningComponent,
        CommandsComponent,
        ProfileComponent,
        UserListComponent,
        VehiculeComponent,
        StatisticComponent,
        UserCreateModalComponent,
        ManagerUserListComponent,
        NavbarComponent,
        CompanyCreateModalComponent,
        CompanyUpdateModalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // LeafletModule
        MatSlideToggleModule,
        MatTableModule,
        MatInputModule,
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatSelectModule,
        ScheduleModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatTooltipModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
