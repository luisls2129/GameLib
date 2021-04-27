import { Component, OnInit } from '@angular/core';
import { Games } from '../servicios/games.service';

import sweet from 'sweetalert2/src/sweetalert2.js'
import { Router } from '@angular/router';
@Component({
  selector: 'app-mis-juegos',
  templateUrl: './mis-juegos.component.html',
  styleUrls: ['./mis-juegos.component.scss']
})
export class MisJuegosComponent implements OnInit {

  constructor(private gamesService: Games, private router: Router) { }

  myGames;
  fecha;
  vacio = false;

  ngOnInit(): void {

    this.gamesService.getGamesOf(localStorage.getItem('userId')).subscribe(response => {
      this.myGames = response;
      this.myGames.forEach(element => {
        element['start_date'] = this.formatearTiempo(element['start_date']);
      });
      if (this.myGames.length == 0) {
        this.vacio = true;
      }
    });

  }

  formatearTiempo(tiempo) {
    let date = new Date(tiempo);
    let timeFormat = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return timeFormat.format(date);
  }

  addGame() {
    this.router.navigate(['addGame'])
  }

  eliminar(game) {
    sweet.fire({
      title: '¿Estas seguro?',
      text: "Vas a eliminar el juego " + game['name'] + " de tu biblioteca",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!, borrar.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gamesService.deleteGameOfUser(localStorage.getItem('userId'), game['game_id']).subscribe(response => {
          this.ngOnInit();
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: 'Eliminado correctamente'
          });
        });
      }
    });

  }

  async editCommentary(game) {
    sweet.fire({
      title: "Cambiar comentario",
      showCancelButton: true,
      input: 'textarea',
      inputPlaceholder: 'Comentario nuevo',
      inputAttributes: {
        maxlength: '250'
      }
    }).then(result => {
      if (result.isConfirmed) {
        let data = {
          "commentary": result.value
        }
        if (result.value == "" || result.value == null) {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'No debe estar vacio'
          });
        } else {
          this.gamesService.putGameOfUser(localStorage.getItem('userId'), game['game_id'], data).subscribe(response => {
            sweet.fire({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'success',
              title: 'Comentario cambiado correctamente'
            });
            this.ngOnInit();
          }, error => {
            console.log(error);
          });
        }
      }
    });
  }

  editAssessment(game) {
    sweet.fire({
      title: "Cambiar Valoracion",
      showCancelButton: true,
      input: 'range',
      inputLabel: 'Valoracion del 1 al 10',
      inputAttributes: {
        min: '1',
        max: '10',
        step: '0.5'
      },
      inputValue: 5
    }).then(result => {
      if (result.isConfirmed) {
        let data = {
          "assessment": result.value
        }
        this.gamesService.putGameOfUser(localStorage.getItem('userId'), game['game_id'], data).subscribe(response => {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: 'Valoracion cambiado correctamente'
          });
          this.ngOnInit();
        });
      }
    });
  }

  editTime(game) {
    sweet.fire({
      title: "Cambiar tiempo de juego",
      showCancelButton: true,
      input: 'range',
      inputLabel: 'Tiempo de juego en horas',
      inputAttributes: {
        min: '0',
        max: '300'
      },
      inputValue: 5
    }).then(result => {
      if (result.isConfirmed) {
        let data = {
          "time": result.value
        }
        this.gamesService.putGameOfUser(localStorage.getItem('userId'), game['game_id'], data).subscribe(response => {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: 'Tiempo de juego cambiado correctamente'
          });
          this.ngOnInit();
        });
      }
    });
  }

  editStartDate(game) {
    let time;
    sweet.fire({
      title: "Cambiar tiempo de juego",
      showCancelButton: true,
      html: '<div id="boxDate"></div>',
      didOpen: function () {
        document.getElementById('inputStartDate').setAttribute('style', 'display: inline');
        document.getElementById('boxDate').append(document.getElementById('inputStartDate'));
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.fecha = new Date(this.fecha);
        let ahora = new Date(Date.now());
        if (this.fecha < ahora) {
          let data = {
            "start_date": this.fecha
          }
          this.gamesService.putGameOfUser(localStorage.getItem('userId'), game['game_id'], data).subscribe(response => {
            sweet.fire({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'success',
              title: 'Fecha de inicio de juego cambiado correctamente'
            });
            this.ngOnInit();
          });
        } else {
          sweet.fire({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: 'La fecha ha de ser anterior a hoy u hoy'
          });
        }
      }
    });
  }
}
