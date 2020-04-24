import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  
  export class ContactService {
    constructor(private contactapicall:HttpClient){}
    private _url:string="http://famposo.in/famposo.in/frontendzone/webapi/";

    AddContact(rfqData):Observable<any>
    {
       return this.contactapicall.post<any>(this._url+"Contactmail.php",rfqData).catch(this.errorHandler);
    }
    errorHandler(error:HttpErrorResponse)
  {
     return Observable.throw(error.message || "Server Error");
  }
  }
