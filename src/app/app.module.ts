import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketComponent, WebsocketDialogComponent } from './services/websocket/websocket.component';
import { AlertComponent } from './components/alert/alert.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './login/login.component';
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
import { UserCreateModalComponent } from './admin/modals/user-create-modal/user-create-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ManagerUserListComponent } from './manager/manager-user-list/manager-user-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyCreateModalComponent } from './admin/modals/company-create-modal/company-create-modal.component';
import { CompanyUpdateModalComponent } from './admin/modals/company-update-modal/company-update-modal.component';
import { UserUpdateModalComponent } from './admin/modals/user-update-modal/user-update-modal.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddCommandComponent } from './commands/modals/add-command/add-command.component';
import { EditCommandComponent } from './commands/modals/edit-command/edit-command.component';
import { DetailsCommandComponent } from './commands/modals/details-command/details-command.component';
import { DetailsVehiculeComponent } from './vehicule/modals/details-vehicule/details-vehicule.component';
import { AddVehiculeComponent } from './vehicule/modals/add-vehicule/add-vehicule.component';
import { EditVehiculeComponent } from './vehicule/modals/edit-vehicule/edit-vehicule.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateScheduleModalComponent } from './schedule/modals/create-schedule-modal/create-schedule-modal.component';
import { CreateOrderModalComponent } from './schedule/OrderBar/create-order-modal/create-order-modal.component';
import { UpdateScheduleModalComponent } from './schedule/modals/update-schedule-modal/update-schedule-modal.component';
import { VisualizeScheduleDayComponent } from './schedule/modals/visualize-schedule-day/visualize-schedule-day.component';
import { PropositionComponent } from './schedule/modals/delivery-proposition-modal/create-proposition-modal';
import { DelivererAbsenceModalComponent } from './schedule/modals/create-absent-modal/create-absent-modal';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientComponent } from './client/client.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerGestionClientComponent } from './manager/manager-gestion-client/manager-gestion-client.component';
import { ManagerToolsComponent } from './manager/manager-tools/manager-tools.component';
import { AddClientComponent } from './manager/manager-gestion-client/modals/add-client/add-client.component';
import { EditClientComponent } from './manager/manager-gestion-client/modals/edit-client/edit-client.component';
import { ManagerUserUpdateModalComponent } from './manager/user-update-modal/user-update-modal.component';
import { ManagerUserCreateModalComponent } from './manager/user-create-modal/user-create-modal.component';
import { ManagerUserVehicleUpdateModalComponent } from './manager/user-vehicle-update-modal/user-vehicle-update-modal.component';
import { VehicleExpenseCreateModalComponent } from './vehicule/modals/vehicle-expense-create-modal/vehicle-expense-create-modal.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationShowModalComponent } from './notification/notification-show-modal/notification-show-modal.component';
import { LockVehicleComponent } from './commands/modals/lock-vehicle-modal/lock-vehicle-modal.component';
import { FilterBarComponent } from './schedule/FilterBar/filterBar.component';
import { OrderBarComponent } from './schedule/OrderBar/orderBar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EditVehiculeExpenseComponent } from './statistic/modals/edit-vehicule-expense/edit-vehicule-expense.component';
import { ManagerTeamsComponent } from './manager/manager-teams/manager-teams.component';
import { UpdateTeamsModalComponent } from './manager/update-teams-modal/update-teams-modal.component';
import { CreateTeamsModalComponent } from './manager/create-teams-modal/create-teams-modal.component';
import { DatePipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { AssignDelivererModal } from './schedule/OrderBar/assign-deliverer-modal/assign-deliverer-modal.component';
registerLocaleData(localeFr);
import { LockVehicleModalComponent } from './vehicule/modals/lock-vehicle/lock-vehicle.component';

@NgModule({
    declarations: [
        AppComponent,
        WebsocketComponent,
        WebsocketDialogComponent,
        AlertComponent,
        MapComponent,
        LoginComponent,
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
        EditCommandComponent,
        DetailsCommandComponent,
        DetailsVehiculeComponent,
        AddVehiculeComponent,
        EditVehiculeComponent,
        CreateScheduleModalComponent,
        UpdateScheduleModalComponent,
        VisualizeScheduleDayComponent,
        ClientComponent,
        ManagerComponent,
        ManagerGestionClientComponent,
        ManagerToolsComponent,
        AddClientComponent,
        EditClientComponent,
        ManagerUserUpdateModalComponent,
        ManagerUserCreateModalComponent,
        ManagerUserVehicleUpdateModalComponent,
        VehicleExpenseCreateModalComponent,
        LoadingSpinnerComponent,
        ConfirmModalComponent,
        NotificationComponent,
        NotificationShowModalComponent,
        LockVehicleComponent,
        LockVehicleModalComponent,
        FilterBarComponent,
        OrderBarComponent,
        PropositionComponent,
        DelivererAbsenceModalComponent,
        EditVehiculeExpenseComponent,
        ManagerTeamsComponent,
        UpdateTeamsModalComponent,
        CreateTeamsModalComponent,
        CreateOrderModalComponent,
        AssignDelivererModal
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
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatTooltipModule,
        FullCalendarModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatMenuModule,
        MatExpansionModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr' },
        DatePipe,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
