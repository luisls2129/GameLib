import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { MisJuegosComponent } from './mis-juegos/mis-juegos.component';
import { RegistroComponent } from './registro/registro.component';
import { AddGameComponent } from './add-game/add-game.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InicioComponent,
    LoginComponent,
    MisJuegosComponent,
    RegistroComponent,
    AddGameComponent,
    MiCuentaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
