import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { login } from '../modelos/login';
import { AuthenticateService } from '../servicios/authenticate.service';
import { ComunicacionMenuService } from '../servicios/comunicacion-menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthenticateService, private router: Router, public comunicacionMenu : ComunicacionMenuService) { }

  ngOnInit(): void {
    this.authService.comprobarAutenticacion().subscribe(response =>{
      if (response == false) {
        this.mostrar=false;
        this.router.navigate(['inicio']);
      }else{
        this.mostrar = true;
      }
    });
    setInterval(() => {
      this.authService.comprobarAutenticacion().subscribe(response =>{
        if (response == false) {
          this.mostrar=false;
        }else{
          this.mostrar = true;
        }
      });
    }, 60000);
  }

  mostrar : boolean | Observable<boolean>;

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['inicio']);
    this.mostrar = false;
  }
}
