import { Injectable } from '@angular/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SteamService {

  constructor(private http: HttpClient) { }

  keySteam = "key=76479A32E2F05FE7BB1E2EE9F867CC16";

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {

      if (error.url == "") {

      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  getGamesOfUser(userID: string): Observable<any> {

    //montar URL
    let url = "/IPlayerService/GetOwnedGames/v0001/?format=json";

    let user = "steamid=" + userID;
    let completeUrl = url + "&" + user + "&" + this.keySteam;

    return this.http.get<any>(completeUrl).pipe(retry(2));

  }

  getUserInfo(steamids: string): Observable<any> {

    let url = "/ISteamUser/GetPlayerSummaries/v0002/?";

    let completeUrl = url + "&" + this.keySteam + "&steamids=" + steamids;

    return this.http.get<any>(completeUrl).pipe(retry(10), catchError(this.handleError));

  }

  getGameInfo(gameID: string): Observable<any> {

    let url = "/api/appdetails?";

    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*');

    let completeUrl = url + "appids=" + gameID;

    return this.http.get<any>(completeUrl, { 'headers': headers }).pipe(retry(10), catchError(this.handleError));
  }
}
