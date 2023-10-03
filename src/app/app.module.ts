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
import { MatDialogModule } from '@angular/material/dialog';
import { UserCreateModalComponent } from './admin/user-create-modal/user-create-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

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
        UserCreateModalComponent,
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
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
