import { Component, OnInit } from '@angular/core';
import { Games } from '../servicios/games.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private lastAdded: Games) { }

  datas;

  ngOnInit(): void {
    this.lastAdded.getLastGamesAdded().subscribe(response => {
      this.datas = response;
      console.log(('hola').length);
    });

  }

}
