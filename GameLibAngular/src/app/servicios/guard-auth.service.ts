import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class GuardAuthService implements CanActivate{

  constructor(private auth : AuthenticateService, private router : Router) { }

  canActivate(): Observable<boolean>{
    return this.auth.comprobarAutenticacion();
  }
}
