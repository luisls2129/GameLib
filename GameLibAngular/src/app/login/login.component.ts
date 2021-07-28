import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { login } from '../modelos/login';
import { AuthenticateService } from '../servicios/authenticate.service';
import { ComunicacionMenuService } from '../servicios/comunicacion-menu.service';

import sweet from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticateService, private router: Router, private comunicacionMenu : ComunicacionMenuService) { }

  email: string;
  password: string;

  ngOnInit(): void {
  }

  error;

  @Output() mostrarMenu = new EventEmitter<boolean>();

  enviar() {
    this.resetearError();
    let loginObj: login = {
      "email": this.email,
      "password": this.password
    }
    let validarMail = new RegExp("([A-Za-z0-9]+)([@]{1})([A-Za-z0-9]+)([.]{1})([a-z]{2,4})");
    if (!validarMail.exec(this.email)) {
      document.getElementById('boxEmailLogin').setAttribute('style', 'border: 2px solid red');
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Formato de Email erroneo'
      });
    }else if(this.password == "" || this.password == undefined) {
      document.getElementById('boxPasswordLogin').setAttribute('style', 'border: 2px solid red');
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Contraseña vacia'
      });
    } else {
      this.authService.login(loginObj).subscribe(response => {
        alert(response['user']['email']);
        //console.log(response['user']['_id']);
        localStorage.setItem('token', response['token']);
        localStorage.setItem('userId', response['user']['_id']);
        localStorage.setItem('email', response['user']['email']);
        localStorage.setItem('idSteam', response['user']['idSteam']);
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
          title: 'Logueado correctamente, Bienvenido'
        });

        setTimeout(() => {
          location.reload();
        }, 1000);
        this.router.navigate(['/inicio']);
      }, error => {
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: error
        });
      });
    }
  }

  resetearError(){
    document.getElementById('boxEmailLogin').setAttribute('style', 'border: 1px solid black');
    document.getElementById('boxPasswordLogin').setAttribute('style', 'border: 1px solid black');
  }
}
