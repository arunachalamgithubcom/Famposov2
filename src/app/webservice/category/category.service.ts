import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _url:string="http://famposo.in/famposo.in/frontendzone/webapi/";
  constructor(private http:HttpClient) { }
  getcategory():Observable<any>
  {
    return this.http.get<any>(this._url+"category.php")
    .catch(this.errorHandler);
  }
  getsubcategory():Observable<any>
  {
    return this.http.get<any>(this._url+"subcategory.php")
    .catch(this.errorHandler);
  }
  getsubcategoryfilter(data):Observable<any>
  {
    return this.http.post<any>(this._url+"subcategory.php",data)
    .catch(this.errorHandler);
  }
  errorHandler(error:HttpErrorResponse)
  {
     return Observable.throw(error.message || "Server Error");
  }
}
