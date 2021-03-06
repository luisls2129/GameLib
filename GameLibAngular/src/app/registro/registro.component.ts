import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from '../modelos/register';
import { AuthenticateService } from '../servicios/authenticate.service';

import sweet from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  constructor(private authenticate: AuthenticateService, private router: Router) { }

  nombre;
  email;
  password;
  password_confirmation;
  error;

  ngOnInit(): void {
  }

  enviar() {
    if (this.validarDatos()) {
      let objRegistro: register = {
        "name": this.nombre,
        "email": this.email,
        "password": this.password,
        "password_confirmation": this.password_confirmation
      }
      this.authenticate.register(objRegistro).subscribe(response => {
        localStorage.setItem('token', response['token']);
        localStorage.setItem('userId', response['user']['_id']);
        localStorage.setItem('email', response['user']['email']);
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'succes',
          title: "Registrado correctamente, Bienvenido!"
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
        this.router.navigate(['inicio']);
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
        console.log(error);
        this.error = error;
      })
    }
  }

  validarDatos() {
    this.resetearError();
    let aceptado = true;
    let validarMail = new RegExp("([A-Za-z0-9]+)([@]{1})([A-Za-z0-9]+)([.]{1})([a-z]{2,4})");
    let validarPassword = new RegExp("([A-Za-z0-9]{6,})");
    let arrayEspacios = this.nombre.split(" ");

    if (this.nombre.length > 12) {
      aceptado = false;
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "El nombre debe tener como m??ximo 12 car??cteres"
      });
    }else if (arrayEspacios.length > 1) {
      aceptado = false;
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Nombre no puede llevar espacios"
      });
    }else if(this.nombre == "" || this.nombre == undefined) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Nombre vacio"
      });
      document.getElementById('boxNameRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "El nombre no puede estar vacio";
    } else if (!validarMail.exec(this.email)) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Formatio de email erroneo"
      });
      document.getElementById('boxEmailRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "Formato de email incorrecto";
    } else if (this.password == "" || this.password == undefined) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Contrase??a vacia"
      });
      document.getElementById('boxPasswordRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "La contrase??a no puede estar vacia";
    } else if (this.password_confirmation == "" || this.password_confirmation == undefined) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Confirmacion de contrase??a vacio"
      });
      document.getElementById('boxPasswordConfirmationRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "La confirmacion de la contrase??a no puede estar vacia";
    }else if (!validarPassword.exec(this.password)) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "La contrase??a ha de tener minimo 6 car??cteres. Solo se permiten letras (may??sculas y min??sculas) y n??meros"
      });
      document.getElementById('boxPasswordRegister').setAttribute('style', 'border: 2px solid red');
      document.getElementById('boxPasswordConfirmationRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "La contrase??a ha de tener minimo 6 car??cteres. Solo se permiten letras (may??sculas y min??sculas) y n??meros";
    } else if (this.password != this.password_confirmation) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: "Las contrase??as no coinciden"
      });
      document.getElementById('boxPasswordRegister').setAttribute('style', 'border: 2px solid red');
      document.getElementById('boxPasswordConfirmationRegister').setAttribute('style', 'border: 2px solid red');
      aceptado = false;
      this.error = "Las contrase??as no coinciden";
    }

    return aceptado;
  }

  resetearError(){
    document.getElementById('boxEmailRegister').setAttribute('style', 'border: 1px solid black');
    document.getElementById('boxNameRegister').setAttribute('style', 'border: 1px solid black');
    document.getElementById('boxPasswordRegister').setAttribute('style', 'border: 1px solid black');
    document.getElementById('boxPasswordConfirmationRegister').setAttribute('style', 'border: 1px solid black');
  }
}
