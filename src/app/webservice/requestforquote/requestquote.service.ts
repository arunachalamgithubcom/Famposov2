import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs/Observables';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';




@Injectable({
  providedIn: 'root'
})
export class RequestquoteService {
   private _url:string="http://famposo.in/famposo.in/frontendzone/webapi/";
  
  constructor(private http:HttpClient){}
  getRfqdata(rfqdata):Observable<any>
  {
      return this.http.post<any>(this._url+"getRequestForQuoteData.php",rfqdata)
                      .catch(this.errorHandler);
  }
  rfqpost(rfqData):Observable<any>
  {
     return this.http.post<any>(this._url+"RequestForQuotePostNew.php",rfqData).catch(this.errorHandler);
  }
   captchacheck(capData):Observable<any>
  {
     
     return this.http.post<any>(this._url+"captcha.php",capData).catch(this.errorHandler);
  }
  rfqcheck(rfqData):Observable<any>
  {
     return this.http.post<any>(this._url+"checkreference_no.php",rfqData).catch(this.errorHandler);
  }
  rfqpostcheck(rfqData):Observable<any>
  {
     return this.http.post<any>(this._url+"verifyrfqpost.php",rfqData).catch(this.errorHandler);
  }
  rfqedit(rfqData):Observable<any>
  {
     return this.http.post<any>(this._url+"updateRequestForQuote.php",rfqData).catch(this.errorHandler);
  }
  rfqdelete(rfqData):Observable<any>
  {
     return this.http.post<any>(this._url+"deleteRequestForQuote.php",rfqData).catch(this.errorHandler);
  }
  errorHandler(error:HttpErrorResponse)
  {
     return Observable.throw(error.message || "Server Error");
  }
}
