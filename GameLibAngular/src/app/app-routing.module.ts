import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGameComponent } from './add-game/add-game.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component';
import { MisJuegosComponent } from './mis-juegos/mis-juegos.component';
import { RegistroComponent } from './registro/registro.component';
import { GuardAuthService } from './servicios/guard-auth.service';

const routes: Routes = [
  {path : '', component : InicioComponent},
  {path : 'inicio', component : InicioComponent},
  {path : 'login', component : LoginComponent},
  {path : 'registro', component : RegistroComponent},
  {path : 'misJuegos', component : MisJuegosComponent, canActivate : [GuardAuthService]},
  {path : 'addGame', component : AddGameComponent, canActivate : [GuardAuthService]},
  {path : 'miCuenta', component : MiCuentaComponent, canActivate : [GuardAuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
