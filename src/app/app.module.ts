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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    CarteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // LeafletModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
