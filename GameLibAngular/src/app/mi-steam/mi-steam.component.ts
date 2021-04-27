import { Component, OnInit } from '@angular/core';
import { UsuarioSteam } from '../modelos/UsuarioSteam';
import { GameSteam } from '../modelos/gameSteam';
import paises from '../servicios/paises.json';
import { SteamService } from '../servicios/steam.service';

@Component({
  selector: 'app-mi-steam',
  templateUrl: './mi-steam.component.html',
  styleUrls: ['./mi-steam.component.scss']
})
export class MiSteamComponent implements OnInit {

  constructor(private steamService: SteamService) { }

  usuarioSteam: UsuarioSteam;
  ubicacion;
  games: Array<GameSteam> = [];

  ngOnInit(): void {

    this.steamService.getUserInfo(localStorage.getItem('idSteam')).subscribe(response => {
      response.response.players.forEach(user => {

        let fecha = this.conversorFecha(user.timecreated * 1000);
        let ultimaConexion = this.conversorFecha(user.lastlogoff * 1000);

        this.usuarioSteam = {
          "nombre": user.personaname,
          "avatar": user.avatarfull,
          "fechaCreacion": fecha,
          "ultimaConexion": ultimaConexion,
          "ciudadCode": user.loccityid,
          "countryCode": user.loccountrycode,
          "estado": user.locstatecode,
          "paginaOficial": user.profileurl
        }
      });

      //Coger ubicacion
      this.ubicacion = {
        "ciudad": paises[this.usuarioSteam.countryCode].states[this.usuarioSteam.estado].cities[this.usuarioSteam.ciudadCode].name,
        "estado": paises[this.usuarioSteam.countryCode].states[this.usuarioSteam.estado].name,
        "pais": paises[this.usuarioSteam.countryCode].name
      }

    });

    this.steamService.getGamesOfUser(localStorage.getItem('idSteam')).subscribe(response => {
      //this.juegos = response.response.games;

      response.response.games.forEach(element => {
        console.log(element);
        if (element.playtime_forever != 0) {
          this.steamService.getGameInfo(element.appid).subscribe(response => {
            console.log(response);
            let id = element.appid;
            let nombre = response[element.appid].data.name;
            let imagen_cabecera = response[element.appid].data.header_image;
            let tiempo = element.playtime_forever;
            let juego: GameSteam = {
              "appid": id,
              "nombre": nombre,
              "tiempo": this.conversionTiempo(tiempo),
              "imagen_cabecera": imagen_cabecera
            }
            this.games.push(juego);
          });
        }
      });

    });

  }

  conversorFecha(tiempo) {
    let date = new Date(tiempo);
    let fecha = date.getDate() +
      "/" + (date.getMonth() + 1) +
      "/" + date.getFullYear();
    return fecha;
  }

  conversionTiempo(minutos) {


    let calcHoras = Math.floor(minutos / 60);
    let horas = (calcHoras < 10) ? '0' + calcHoras : calcHoras;
    let calcMinute = Math.floor(minutos % 60);
    let minutos_finales = (calcMinute < 10) ? '0' + calcMinute : calcMinute;
    let final = horas + ' horas y ' + minutos_finales + ' minutos';

    return final;
  }

}
