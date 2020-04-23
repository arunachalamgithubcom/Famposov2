import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';

@Injectable({
  providedIn: 'root'
})
export class SocialloginService {

  private _url:string="http://famposo.in/famposo.in/frontendzone/webapi/";

  constructor(private http:HttpClient) { }

  Savesresponse(response):Observable<any>
  {
  
    return this.http.post<any>(this._url+"register.php",response)
                              .catch(this.errorHandler);
  }
  otp(response):Observable<any>
  {
  
    return this.http.post<any>(this._url+"emailverification.php",response)
                              .catch(this.errorHandler);
  }
  verify_oauthid(response):Observable<any>
  {
    return this.http.post<any>(this._url+"validation.php",response)
    .catch(this.errorHandler);
  }
  verifyuser(response):Observable<any>
  {
    return this.http.post<any>(this._url+"loginverification.php",response)
    .catch(this.errorHandler);
  }
  errorHandler(error:HttpErrorResponse)
  {
     return Observable.throw(error.message || "Server Error");
  }
 
}
