import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { gameToUser } from '../modelos/gameToUser';
import { Games } from '../servicios/games.service';
import { UploadService } from '../servicios/upload.service';

import sweet from 'sweetalert2/src/sweetalert2.js'
@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {

  constructor(private gameService: Games, private uploadService: UploadService, private router: Router) { }

  getAllGames;
  getGamesOf;
  games = [];
  game;
  name;
  formData = new FormData();
  viewSelectGame = true;
  viewAddGame = false;
  viewCreateGame = false;
  commentary;
  assessment: number = 5;
  time: number = 0;
  start_date;
  error;

  ngOnInit(): void {
    this.games = [];
    this.gameService.getGames().subscribe(response => {
      this.getAllGames = response;
      this.gameService.getGamesOf(localStorage.getItem('userId')).subscribe(response => {
        this.getGamesOf = response
        //comprobar que no muestre los que ya tiene en su biblioteca
        this.getAllGames.forEach(game => {
          let match = false;
          this.getGamesOf.forEach(gameOf => {
            if (game['_id'] == gameOf['game_id']) {
              match = true;
            }
          });

          if (!match) {
            this.games.push(game);
          }
        });
      })
    });
  }

  createGame() {
    sweet.fire({
      title: 'Nombre',
      text: "Introduce el nombre del juego que quieres crear.",
      icon: 'question',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Siguiente'
    }).then((result) => {
      if (result.value != "" && result.value != null) {
        this.name = result.value;
        sweet.fire({
          title: 'Imagen',
          text: "Introduce una imagen apaisada que represente al juego.",
          icon: 'question',
          input: 'file',
          inputAttributes: {
            accept: 'image/*'
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Siguiente'
        }).then((result) => {
          if (result.value != null) {

            this.formData.append('file', result.value);
            this.formData.append('upload_preset', 'angular_prueba');
            this.formData.append('cloud_name', 'luislopez2129');

            this.uploadService.uploadImage(this.formData).subscribe((response) => {
              let game = {
                "name": this.name,
                "url_image": response['url']
              }
              this.gameService.addGame(game).subscribe(response => {
                sweet.fire({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  icon: 'success',
                  title: 'Juego creado correctamente'
                });
                this.ngOnInit();
              })
            }, error => {
              this.error = error;
            })
          }else{
            sweet.fire({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              icon: 'error',
              title: 'Has de seleccionar una imagen'
            });
          }
        });
      }else{
        sweet.fire({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          icon: 'error',
          title: 'El nombre no puede estar vacio'
        });
      }
    });
  }

  addThisGame(game) {
    this.viewSelectGame = false;
    this.viewAddGame = true;
    this.game = game;
  }

  cancel() {
    this.viewSelectGame = true;
    this.viewAddGame = false;
    this.viewCreateGame = false;
    this.commentary = "";
    this.assessment = 0;
    this.time = 0;
    this.start_date = Date;
    this.game = "";
  }

  confirm() {

    if (this.validateConfirm()) {
      let body = {
        "game_id": this.game['_id'],
        "commentary": this.commentary,
        "assessment": this.assessment,
        "time": this.time,
        "start_date": this.start_date
      }

      this.gameService.addGameToUser(localStorage.getItem('userId'), body).subscribe(response => {

        this.router.navigate(['misJuegos']);

      }, error => {
        this.error = error;
      })
    }
  }

  validateConfirm() {
    let validateTime = new RegExp("([0-9]+)");
    let time = this.time.toString();
    console.log(validateTime.exec("5"));
    let validateAssessment = new RegExp("([0-9]{1})");
    let date = new Date(this.start_date);
    let ahora = new Date(Date.now());
    let accept = true;
    if (this.commentary == null || this.commentary == "") {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Debes añadir un comentario'
      });
      accept = false;
    }else if (this.assessment == 0 || this.assessment == undefined || this.assessment == null) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Debes añadir una valoracion'
      });
      accept = false;
    } else if (!validateAssessment.exec(this.assessment.toString()) || this.assessment > 10 || this.assessment < 0) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'La valoración debe ser un número y comprendido entre 0 y 10'
      });
      accept = false;
    } else if (this.time == undefined || this.time == null) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Debes añadir un tiempo de juego'
      });
      accept = false;
    }else if (this.start_date == "" || this.start_date == undefined) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'Debes añadir una fecha de inicio de juego'
      });
      accept = false;
    } else if (date > ahora) {
      sweet.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        title: 'La fecha ha de ser anterior a hoy u hoy'
      });
      accept = false;
    }
    return accept;
  }

}
