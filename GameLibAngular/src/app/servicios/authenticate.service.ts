import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { login } from '../modelos/login';
import { register } from '../modelos/register';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http : HttpClient) { }

  url = "http://127.0.0.1:8000/api/";

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else if(error.status == 400){
      /*console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);*/

        if (error.url == "http://127.0.0.1:8000/api/login") {
          return throwError('Contraseña o Email erroneos');
        }else{
          return throwError(error.error);
        }
    }
  }

  login(loginObj : login) : Observable<any>{

    let completeUrl = this.url + "login";
    return this.http.post(completeUrl, loginObj).pipe(retry(2), catchError(this.handleError));
  }

  register(registerObj : register){

    let completeUrl = this.url + "register";

    return this.http.post(completeUrl, registerObj).pipe(retry(2), catchError(this.handleError));
  }

  comprobarAutenticacion(): Observable<boolean>{

    let completeUrl = this.url + "comprobarToken";

    const headers = new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('token'));

    return this.http.get(completeUrl, { 'headers': headers }).pipe(map(res => {
      if (res == "1") {
        return true;
      }else{
        return false;
      }
    }));

  }
}
