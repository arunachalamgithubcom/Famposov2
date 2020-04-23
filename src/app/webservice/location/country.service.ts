import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs/observable';

import { Countrymodel } from '../../model/location/country';
import { Statesmodel } from '../../model/location/states';
import { Phonecodemodel }  from '../../model/location/phonecode';
import { Citiesmodel } from '../../model/location/city';
  
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  //private _url:string="https://www.famposo.com/test/api/";
  private _url:string=" http://famposo.in/famposo.in/frontendzone/webapi/";
 
  constructor(private http:HttpClient) {}
  getCountrycode():Observable<Countrymodel[]>
  {
      return this.http.get<Countrymodel[]>(this._url+"countrycode.php")
                      .catch(this.errorHandler);
  }
  getStates(id: any): Observable<any> {
    return this.http.get<Statesmodel[]>(this._url+"statesfilter.php?country_id="+id).catch(this.errorHandler);
  }
  getCode(id: any): Observable<any> {
    return this.http.get<Phonecodemodel[]>(this._url+"phonecode.php?country_id="+id).catch(this.errorHandler);
  }
  getCity(id: any): Observable<any> {
    return this.http.get<Citiesmodel[]>(this._url+"citiesfilter.php?state_id="+id).catch(this.errorHandler);
  }
  getphonecode(ref: any): Observable<any> {
    return this.http.get<Citiesmodel[]>(this._url+"referencephonecode.php?reference_no="+ref).catch(this.errorHandler);
  }
  getAllcity(ref: any): Observable<any> {
    return this.http.get<Citiesmodel[]>(this._url+"referencecityfilter.php?reference_no="+ref).catch(this.errorHandler);
  }
  getAllstates(ref: any): Observable<any> {
    return this.http.get<Statesmodel[]>(this._url+"referencestatefilter.php?reference_no="+ref).catch(this.errorHandler);
  }
  errorHandler(error:HttpErrorResponse)
  {
     return Observable.throw(error.message || "Server Error");
  }
}
