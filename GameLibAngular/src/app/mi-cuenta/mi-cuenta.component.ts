import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs/operators';
import { login } from '../modelos/login';
import { User } from '../modelos/User';
import { AuthenticateService } from '../servicios/authenticate.service';
import { Games } from '../servicios/games.service';
import { SteamService } from '../servicios/steam.service';
import { UploadService } from '../servicios/upload.service';

import sweet from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss']
})
export class MiCuentaComponent implements OnInit {

  constructor(private gameService: Games, private authService: AuthenticateService, private steamService: SteamService, private uploadService: UploadService, private router: Router) { }

  oldUser: User;
  newUser: User;
  oldPassword;
  newPassword;
  passwordConfirmation;
  cambiarPassword = false;
  formData = new FormData();
  verMiSteam = false;
  error;

  ngOnInit(): void {
    this.gameService.getUser(localStorage.getItem('userId')).subscribe(response => {
      this.oldUser = {
        "name": response['name'],
        "email": response['email'],
        "icon": response['icon'],
        "idSteam": response['idSteam']
      }
console.log(response);
      this.newUser = {
        "name": response['name'],
        "email": response['email'],
        "icon": response['icon'],
        "idSteam": response['idSteam']
      }

      this.comprobarIdSteam();
    });
  }

  changeName() {
    sweet.fire({
      title: "Cambiar nombre de usuario",
      showCancelButton: true,
      input: 'text',
      inputLabel: 'Introduzca el nuevo nombre de usuario',
    }).then(result => {
      let arrayEspacios = result.value.split(' ');
      console.log(arrayEspacios.length);
      if (arrayEspacios.length == 1) {
        if (result.value.length <= 12) {
          if (result.value != this.oldUser.name) {
            if (result.isConfirmed && result.value != "") {
              let user = {};
              user['name'] = result.value;
              sweet.fire({
                title: "Introduzca tu contraseña",
                showCancelButton: true,
                input: 'password',
              }).then(result => {
                if (result.isConfirmed && result.value != "") {
                  let loginObj: login = {
                    "email": localStorage.getItem('email'),
                    "password": result.value
                  }
                  this.authService.login(loginObj).subscribe(response => {
                    this.gameService.putUser(localStorage.getItem('userId'), user).subscribe(response => {
                      sweet.fire({
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        icon: 'success',
                        title: 'Nombre de usuario cambiado correctamente'
                      })
                      this.ngOnInit();
                    }, error => {
                      if (error.error == "Este nombre ya está en uso") {
                        sweet.fire({
                          toast: true,
                          position: 'bottom-end',
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true,
                          icon: 'error',
                          title: 'Este nombre de usuario ya está en uso'
                        })
                      }
                    });
                  }, error => {
                    sweet.fire({
                      toast: true,
                      position: 'bottom-end',
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      icon: 'error',
                      title: 'Contraseña erronea'
                    })
                  })
                } else {
                  sweet.fire({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'Contraseña vacia'
                  })
                }

              });
            } else {
              sweet.fire({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Nombre de usuario introducido vacio'
              })
            }
          } else {
            sweet.fire({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'error',
              title: 'Introduzca un nombre de usuario distinto al actual'
            })
          }
        } else {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'El nombre debe tener como máximo 12 carácteres'
          })
        }
      } else {
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: "El nombre no puede tener espacios"
        });
      }
    });
  }

  changeEmail() {
    sweet.fire({
      title: "Cambiar emial",
      showCancelButton: true,
      input: 'text',
      inputLabel: 'Introduzca el nuevo emial',
    }).then(result => {
      if (result.value != this.oldUser.email) {
        if (result.isConfirmed && result.value != "") {
          let user = {};
          user['email'] = result.value;
          sweet.fire({
            title: "Introduzca tu contraseña",
            showCancelButton: true,
            input: 'password',
          }).then(result => {
            if (result.isConfirmed && result.value != "") {
              let loginObj: login = {
                "email": localStorage.getItem('email'),
                "password": result.value
              }
              console.log(loginObj);
              this.authService.login(loginObj).subscribe(response => {

                this.gameService.putUser(localStorage.getItem('userId'), user).subscribe(response => {
                  localStorage.setItem('email', user['email']);
                  console.log(response);
                  sweet.fire({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'success',
                    title: 'Email cambiado correctamente'
                  })
                  this.ngOnInit();
                }, error => {
                  if (error.error == "Este emial ya está en uso") {
                    sweet.fire({
                      toast: true,
                      position: 'bottom-end',
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      icon: 'error',
                      title: 'Este emial ya está en uso'
                    })
                  }
                });
              }, error => {
                sweet.fire({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  icon: 'error',
                  title: 'Contraseña erronea'
                })
              })
            } else {
              sweet.fire({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Contraseña vacia'
              })
            }

          });
        } else {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'Email introducido vacio'
          })
        }
      } else {
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: 'Introduzca un email distinto al actual'
        })
      }
    });
  }

  changePassword() {
    sweet.fire({
      title: "Cambiar contraseña",
      showCancelButton: true,
      input: 'password',
      inputLabel: 'Introduzca la nueva contraseña (Min 6 carácteres)',
    }).then(result => {
      if (result.isConfirmed && result.value != "") {
        if (result.value.length >= 6) {
          let user = {};
          user['password'] = result.value;
          sweet.fire({
            title: "Introduzca tu antigua contraseña",
            showCancelButton: true,
            input: 'password',
          }).then(result => {
            if (result.isConfirmed && result.value != "") {
              let loginObj: login = {
                "email": localStorage.getItem('email'),
                "password": result.value
              }
              console.log(user);
              this.authService.login(loginObj).subscribe(response => {
                this.gameService.putUser(localStorage.getItem('userId'), user).subscribe(response => {
                  sweet.fire({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'success',
                    title: 'Contraseña cambiada correctamente'
                  })
                  this.ngOnInit();
                }, error => {

                });
              }, error => {
                sweet.fire({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  icon: 'error',
                  title: 'Contraseña antigua erronea'
                })
              })
            } else {
              sweet.fire({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Contraseña antigua vacia'
              })
            }

          });
        } else {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'Contaseña minimo 6 carácteres'
          })
        }
      } else {
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: 'Contraseña nueva introducida vacia'
        })
      }
    });
  }

  changeIdSteam() {
    sweet.fire({
      title: "Cambiar Id Steam",
      showCancelButton: true,
      input: 'text',
      inputLabel: 'Introduzca tu id de Steam',
    }).then(result => {
      if (result.isConfirmed && result.value != "") {
        if (result.value != this.oldUser.idSteam) {
          let id = result.value;
          sweet.fire({
            title: "Introduzca tu contraseña",
            showCancelButton: true,
            input: 'password',
          }).then(result => {
            if (result.isConfirmed && result.value != "") {
              let loginObj: login = {
                "email": localStorage.getItem('email'),
                "password": result.value
              }
              this.authService.login(loginObj).subscribe(response => {
                this.steamService.getGamesOfUser(id).subscribe(response => {
                  let idSteam = {
                    "idSteam": id
                  }
                  this.gameService.putUser(localStorage.getItem('userId'), idSteam).subscribe(response => {
                    localStorage.setItem('idSteam', response['idSteam']);
                    this.verMiSteam = true;
                    this.ngOnInit();
                    sweet.fire({
                      toast: true,
                      position: 'bottom-end',
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      icon: 'success',
                      title: 'ID de Steam cambiado correctamente'
                    })
                  });
                }, error => {
                  sweet.fire({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: 'ID de Steam erroneo'
                  })
                });
              }, error => {
                sweet.fire({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  icon: 'error',
                  title: 'Contraseña erronea'
                })
              })
            } else {
              sweet.fire({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'error',
                title: 'Contraseña vacia'
              })
            }

          });
        } else {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'Introduzca un ID de Steam distinto al actual'
          })
        }
      } else {
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: 'ID Steam introducido vacio'
        })
      }
    });
  }

  cambiar() {

    if (this.validarCambiar()) {
      let loginObj: login = {
        "email": localStorage.getItem('email'),
        "password": this.oldPassword
      }
      this.authService.login(loginObj).subscribe(response => {
        let user = {};
        if (this.newUser.name != this.oldUser.name) {
          user['name'] = this.newUser.name;
        }
        if (this.newUser.email != this.oldUser.email) {
          user['email'] = this.newUser.email;
        }
        if (this.newPassword != undefined) {
          user['password'] = this.newPassword;
        }

        if (Object.keys(user).length != 0) {
          this.gameService.putUser(localStorage.getItem('userId'), user).subscribe(response => {
            window.location.reload();
          });
        }
      }, error => {
        this.error = error;
        console.log(this.error);
      });


    }
  }

  cambiarContrasenya() {
    this.cambiarPassword = true;

    (<HTMLInputElement>document.getElementById('inputOldPassword')).placeholder = "Contraseña antigua";
  }

  validarCambiar() {
    let accept = true;
    let validarMail = new RegExp("([A-Za-z0-9]+)([@]{1})([A-Za-z0-9]+)([.]{1})([a-z]{2,4})");
    let validarPassword = new RegExp("([A-Za-z0-9]{6,})");

    if (this.oldUser.name == "" || this.oldUser.name == null || this.oldUser.name == undefined) {
      this.error = "Nombre no puede estar vacio";
      accept = false;
    } else if (this.oldUser.email == "" || this.oldUser.email == null || this.oldUser.email == undefined) {
      this.error = "Email no puede estar vacio";
      accept = false;
    } else if (!validarMail.exec(this.oldUser.email)) {
      this.error = "Formato del email erroneo";
      accept = false;
    } else if (this.oldPassword == "" || this.oldPassword == null || this.oldPassword == undefined) {
      this.error = "La contraseña no puede estar vacia";
      accept = false;
    }
    if (this.newPassword != undefined) {
      if (this.newPassword == "" || this.newPassword == null) {
        this.error = "La nueva contraseña no puede estar vacia";
        accept = false;
      } else if (!validarPassword.exec(this.newPassword)) {
        this.error = "La contraseña debe tener 6 dígitos";
        accept = false;
      } else if (this.newPassword != this.passwordConfirmation) {
        this.error = "Las contraseñas no coinciden";
        accept = false;
      }
    }

    return accept;
  }

  cambiarIcono(event) {
    let file_data = event.target.files[0];

    this.formData.append('file', file_data);
    this.formData.append('upload_preset', 'angular_prueba');
    this.formData.append('cloud_name', 'luislopez2129');

    this.uploadService.uploadImage(this.formData).subscribe(response => {
      let icon = {
        "icon": response['url']
      }

      this.gameService.putUser(localStorage.getItem('userId'), icon).subscribe(response => {
        window.location.reload();
      });
    })
  }

  anyadirIdSteam() {
    if (this.newUser.idSteam != "" || this.newUser.idSteam != null || this.newUser.idSteam != undefined) {
      if (this.newUser.idSteam != this.oldUser.idSteam) {
        this.steamService.getGamesOfUser(this.newUser.idSteam).subscribe(response => {
          let idSteam = {
            "idSteam": this.newUser.idSteam
          }
          this.gameService.putUser(localStorage.getItem('userId'), idSteam).subscribe(response => {
            localStorage.setItem('idSteam', response['idSteam']);
            this.verMiSteam = true;

            //window.location.reload();
          });
        }, error => {
          this.error = "ID de Steam erroneo";
        });
      }
    }
  }

  comprobarIdSteam() {
    console.log("entro");
    this.steamService.getGamesOfUser(this.oldUser.idSteam).subscribe(response => {
      this.verMiSteam = true;
    });
  }
}
