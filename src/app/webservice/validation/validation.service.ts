import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/Http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';

import {Injector} from '@angular/core';

export let InjectorInstance: Injector;

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private injector: Injector) {
    InjectorInstance = this.injector;
  }
  
 
   static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
        'required':'This field is required',
        'invalidNumber': 'Input should be an integer value',
        'invalidEmailAddress': 'Invalid email address',
        'invalidUrl': 'Invalid URL',
        'alphaNumericAllowed': 'Only apha numeric input is allowed',
        'numericAllowed': 'Only numeric values are allowed',
        'invalidQuantity':'Value should not be < Min Quantity',
        'invalidDimension':'Max Dimension should not be < Min Dimension',
        'invalidWeight':'Min Weight should not be < Min Weight',
        'invalidPrice':'Value should not be < Min Price',
        'invalidPhoneLength':'Invalid phone number',
        'invalidDate':'Expected delivery date is same as by date',
        'invalidEmailExist':'Email already exist',
        'invalidPhoneExist':'Mobile no already exist',
    };

    return config[validatorName];
}


  static emailValidator(control: AbstractControl) {
    if (control.value.length == 0 || control.value.match( /^([a-zA-Z])+([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9_.+-])+\.+?(com|co|in|org|net|uk|sg|us|edu|info|gov|vekomy|COM|CO|IN|ORG|NET|UK|SG|US|EDU|INFO|GOV|VEKOMY))\.?(com|co|in|org|net|uk|sg|us|edu|info|gov|COM|CO|IN|ORG|NET|UK|SG|US|EDU|INFO|GOV)?$/)) {
        return null;
    } else {
        return { 'invalidEmailAddress': true };
    }
}

static alpaNumValidator(control: AbstractControl) {
    if (control.value.match(/^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$/)) {
        return null;
    } else {
        return { 'alphaNumericAllowed': true };
    }
}


static numberValidator(control: AbstractControl) {
    if (control.value.length == 0 || control.value.match(/^[0-9]*$/)) {
        return null;
    } else {
        return { 'numericAllowed': true };
    }
}
static urlValidator(control: AbstractControl) {
  const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
 if(control.get('company_url').value!="")
 {
  if (control.get('company_url').value.match(URL_REGEXP)) {
    return null;
  } else {
      
      control.get('company_url').setErrors({ invalidUrl: true });
  }
}
else
{
    return null;
}


}
static DimensionValidator(control: AbstractControl) {
    const Dmin: any = control.get('dimension_length').value;
    const Dmax: any = control.get('dimension_width').value; 
    if (Dmin > Dmax) {
        control.get('dimension_width').setErrors({ invalidDimension: true });
    }
    return null
}
static WeightValidator(control: AbstractControl) {
    const Wmin: any = control.get('weight_min').value;
    const Wmax: any = control.get('weight_max').value; 
    if (Wmin > Wmax) {
        control.get('weight_max').setErrors({ invalidWeight: true });
    }
    return null
}
    static QuantityValidator(control: AbstractControl) {
        const Qmin: any = control.get('quantity_min').value;
        const Qmax: any = control.get('quantity_max').value; 
        if (Qmin > Qmax) {
            control.get('quantity_max').setErrors({ invalidQuantity: true });
        }
        return null
    }
    static PriceRangeValidator(control: AbstractControl) {
        const Pmin: any = control.get('buyprice_min').value;
        const Pmax: any = control.get('buyprice_max').value; 
        if (Pmin > Pmax) {
            control.get('buyprice_max').setErrors({ invalidPrice: true });
        }
        return null
    }
    static DateRangeValidator(control: AbstractControl)
    {
       
        if(new Date(control.get('expected_delivery_date').value)>=new Date(control.get('by_date').value)){
            control.get('by_date').setErrors({ invalidDate: true });
        }
    }
    static PhoneLengthValidator(control: AbstractControl)
    {
        if(control.get('mobile_no').value!="" && control.get('countrycode').value!="")
        {
            const formData = new FormData();
            formData.append('phone_number',control.get('mobile_no').value);
            formData.append('country_code',control.get('countrycode').value);
            const httpClient =  InjectorInstance.get<HttpClient>(HttpClient);
            httpClient.post<any>("http://famposo.in/famposo.in/frontendzone/webapi/PhoneNumberLengthValidation.php",formData).subscribe(response=>{
            if(response.success)
            {
                return null;
            }
            else
            { 
                control.get('mobile_no').setErrors({ invalidPhoneLength: true });
            }
            },error=>console.error('error',error)); 
        }
        else
        {
            return null;
        }
    }
    static emailexist(control: AbstractControl)
    {
        if(control.get('email').value!="")
        {
            const formData = new FormData();
            formData.append('email',control.get('email').value);
            const httpClient =  InjectorInstance.get<HttpClient>(HttpClient);
            httpClient.post<any>("http://famposo.in/famposo.in/frontendzone/webapi/validation.php",formData).subscribe(response=>{
            if(response.success)
            {
                return null;
            }
            else
            { 
                control.get('email').setErrors({ invalidEmailExist: true });
            }
            },error=>console.error('error',error)); 
        }
        else
        {
            return null;
        }
    }
    static mobileexist(control: AbstractControl)
    {
        if(control.get('mobile_no').value!="")
        {
            const formData = new FormData();
            formData.append('mobile_no',control.get('mobile_no').value);
            const httpClient =  InjectorInstance.get<HttpClient>(HttpClient);
            httpClient.post<any>("http://famposo.in/famposo.in/frontendzone/webapi/validation.php",formData).subscribe(response=>{
            if(response.success)
            {
                return null;
            }
            else
            { 
                control.get('mobile_no').setErrors({ invalidPhoneExist: true });
            }
            },error=>console.error('error',error)); 
        }
        else
        {
            return null;
        }
    }
   
}
