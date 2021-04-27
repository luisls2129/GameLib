import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionMenuService {

  constructor() { }

  private mensajero = new ReplaySubject<boolean>(1);

  public get recibir(){
    return this.mensajero.asObservable();
  }

  public enviar(dato){
    this.mensajero.next(dato);
    console.log('entro');
  }
}
