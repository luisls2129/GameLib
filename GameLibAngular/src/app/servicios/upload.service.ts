import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http : HttpClient) { }

  url_cloudinary = "https://api.cloudinary.com/v1_1/luislopez2129/image/upload";
  key_cloudinary = "hoq0xhlg";
  e = "angular_prueba/omgu4x3vbrecs1rm8m7c";

  uploadImage(vals){
    let data = vals;

    return this.http.post(this.url_cloudinary, data);
  }
}
