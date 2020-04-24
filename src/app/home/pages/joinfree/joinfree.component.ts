import { Component, OnInit } from '@angular/core';

import { CountryService } from '../../../webservice/location/country.service';
import { ValidationService } from '../../../webservice/validation/validation.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';

import { AuthService } from "ng-dynami-social-login";
import { FacebookLoginProvider, GoogleLoginProvider,LinkedinLoginProvider } from "ng-dynami-social-login";
import {  SocialloginService } from '../../../webservice/joinfree/sociallogin.service';




declare function timer(remaining:any);
declare var IN: any;


@Component({
  selector: 'app-joinfree',
  templateUrl: './joinfree.component.html',
  styleUrls: ['./joinfree.component.css']
})
export class JoinfreeComponent implements OnInit {
  
  public country=[];
  public states=[];
  public phonecode=[];
  public errorMsg;
  public isResend=true;
  socialusers: any;
  response: any;


  constructor(private spinner: NgxSpinnerService,private _countrymodel:CountryService,private  router: Router, private location: Location,private fb: FormBuilder,private _validation:ValidationService,private OAuth: AuthService,private SocialloginService: SocialloginService) {
  
    this._countrymodel.getCountrycode()
    .subscribe(data => this.country = data ,
               error => this.errorMsg = error);
   }
   
    joinfree=this.fb.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,ValidationService.emailValidator]],
    country:['',Validators.required],
    countrycode:[''],
    mobile_no:['',[Validators.required,ValidationService.numberValidator]],
    otp:['',ValidationService.numberValidator],
    otpmode:[''],
    agree:['',Validators.required]
  },{ validator:[ ValidationService.PhoneLengthValidator,ValidationService.emailexist,ValidationService.mobileexist]});
  ngOnInit():void {
  
   
   }
     public timerOn = true;
     timer(remaining: number) {
     var m:any = Math.floor(remaining / 60);
     var s:any = remaining % 60;
     
     m = m < 10 ? '0' + m : m;
     s = s < 10 ? '0' + s : s;
     document.getElementById('timer').innerHTML = m + ':' + s;
     remaining -= 1;
     
     if(remaining >= 0 && this.timerOn) {
       setTimeout(()=>{
           this.timer(remaining);
       }, 1000);
       return;
     }
   
     if(!this.timerOn) {
     
       return;
     }
     Swal.fire("Timeout for otp");
    this.isResend=false;
 
   }
   public coun=[];
   handleSelected($event)
  {
     
       localStorage.clickcount = 1;
      if ($event.target.checked === true) {
        
        if(this.joinfree.controls['email'].valid)
        {
          
            const formData = new FormData();
            formData.append('email',this.joinfree.value.email);
            this.spinner.show();
            this.SocialloginService.otp(formData).subscribe((res: any) => {this.spinner.hide();  
                if(res.success)
                {
                    Swal.fire("We have sent otp for verification");
                    this.joinfree.controls['otpmode'].disable();
                    this.timer(180);
                  
                }
                else
                {
                  Swal.fire(
                          
                    res.message,
                    'error',
                  )
                }
            }) 
          }
          else
          {
               Swal.fire("Email is invalid");
               
               this.joinfree.controls['otpmode'].reset();
          }
      }
    
  }
  resend()
  {
    
    localStorage.clickcount = Number(localStorage.clickcount) + 1;
    if(localStorage.clickcount<=3)
    {
        this.isResend=true;
        if(this.joinfree.controls['email'].valid)
        {
            
            const formData = new FormData();
            formData.append('email',this.joinfree.value.email);
            this.spinner.show();
            this.SocialloginService.otp(formData).subscribe((res: any) => {this.spinner.hide();  
                if(res.success)
                {
                    Swal.fire("We have sent otp for verification");
                    this.timer(180);
                }
                else
                {
                  Swal.fire(
                          
                    res.message,
                    'error',
                  )
                }
            }) 
          }
          else
            {
                  Swal.fire("Email is invalid");
            } 
    }
    else
    {
      Swal.fire("Your otp limit exceeds");
    }
  }
  selectedcountry: string = '';
  selectedstates:string='';
  joinnow()
  {
   
    this.joinfree.markAllAsTouched();
    const formData = new FormData();
    formData.append('otp',this.joinfree.value.otp);
    if (this.joinfree.valid) {
            if(this.joinfree.controls['agree'].valid)
            {
              this.SocialloginService.otp(formData).subscribe((res: any) => {
                if(res.success)
                {

                  const formData = new FormData();
                  formData.append('name',this.joinfree.value.name);
                  formData.append('email',this.joinfree.value.email);
                  formData.append('country',this.joinfree.value.country);
                  formData.append('phone',this.joinfree.value.mobile_no);
                  formData.append('oauthprovider',"JoinNow");
                  formData.append('joinmode',"joinfree");
                  formData.append('registrationtype',"JoinNow");
                  this.Savesresponse(formData);
                }
                else
                {
                  Swal.fire(
                                
                    res.message,
                    'error',
                  )
                }
              })  
          }
          else
          {
               Swal.fire('Kindly agree with famposo terms and conditions');
          }
        }
  }
 
  facebook()
  {
    this.OAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(async (socialusers) => {  
       
      const formData = new FormData();
      formData.append('id',socialusers.id);
      formData.append('name',socialusers.name);
      formData.append('email',socialusers.email);
      formData.append('oauthprovider',socialusers.provider);
      formData.append('joinmode',"joinfree");
      formData.append('registrationtype',"socialmedia");
      this.SocialloginService.verify_oauthid(formData).subscribe((res: any) => {
        if(res.success)
        {
             this.Savesresponse(formData);
        }
        else
        {
             Swal.fire("User already exist")
        }
      });
     
     
    })
  }
  google()
  {
    this.OAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialusers => {  
      
      const formData = new FormData();
      formData.append('id',socialusers.id);
      formData.append('name',socialusers.name); 
      formData.append('email',socialusers.email);
      formData.append('oauthprovider',socialusers.provider);
      formData.append('joinmode',"joinfree");
      formData.append('registrationtype',"socialmedia");
      this.SocialloginService.verify_oauthid(formData).subscribe((res: any) => {
        if(res.success)
        {
             this.Savesresponse(formData);
        }
        else
        {
             Swal.fire("User already exist")
        }
      });
    })
  }
   Savesresponse(socialusers) {  
    this.spinner.show();
    this.SocialloginService.Savesresponse(socialusers).subscribe((res: any) => { this.spinner.hide();  
       if(res.success)
       {
           Swal.fire("We have sent confirmation mail");
       }
       else
       {
           Swal.fire("Registration failed");
       }
    }) 
      
  } 
  selectChangeCountry (event: any) 
  {
    
    this.selectedcountry = event.target.value;
    const selectEl = event.target;
    const val = selectEl.options[selectEl.selectedIndex].getAttribute('data-somedata');
    this._countrymodel.getStates(val)
    .subscribe(data => this.states = data ,
      error => this.errorMsg = error);
    this._countrymodel.getCode(val)
    .subscribe(data => this.phonecode = data ,
    error => this.errorMsg = error);
  }
 

 

}
