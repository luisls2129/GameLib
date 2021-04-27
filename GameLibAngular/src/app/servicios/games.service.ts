import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Games {

  constructor(private http: HttpClient) { }

  url = "http://127.0.0.1:8000/api/";

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      error);
  }

  getLastGamesAdded(){

    return this.http.get(this.url+"lastGamesAdded").pipe(retry(10), catchError(this.handleError));

  }

  getGamesOf(userId){

    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.get(this.url+"gamesOf/"+userId, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));

  }

  getGames(){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.get(this.url+"games", { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }

  addGameToUser(userId, body){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.post(this.url+"gamesOf/"+userId, body, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }

  addGame(game){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.post(this.url+"games", game, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }

  getUser(userId){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.get(this.url+"getUser/"+userId, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }

  putUser(userId, user){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.post(this.url+"postUser/"+userId, user, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }

  deleteGameOfUser(userId, gameId){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

      return this.http.delete(this.url+"gamesOf/"+userId+"/"+gameId, { 'headers' : headers}).pipe(retry(2), catchError(this.handleError));
  }

  putGameOfUser(userId, gameId, data){
    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.put(this.url+"gamesOf/"+userId+"/"+gameId, data, { 'headers': headers }).pipe(retry(2), catchError(this.handleError));
  }
}
