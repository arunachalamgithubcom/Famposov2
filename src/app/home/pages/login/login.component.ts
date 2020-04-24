import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

import { AuthService } from "ng-dynami-social-login";
import { FacebookLoginProvider, GoogleLoginProvider,LinkedinLoginProvider } from "ng-dynami-social-login";
import { CountryService } from '../../../webservice/location/country.service';
import { ValidationService } from '../../../webservice/validation/validation.service';
import { RequestquoteService } from '../../../webservice/requestforquote/requestquote.service';
import {  SocialloginService } from '../../../webservice/joinfree/sociallogin.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public country=[];
  public states=[];
  public phonecode=[];
  public errorMsg;
  cresponse: string;

  constructor(private spinner: NgxSpinnerService,private _countrymodel:CountryService,private  router: Router,private location: Location,private fb: FormBuilder,private _validation:ValidationService,private OAuth: AuthService,private SocialloginService: SocialloginService,private _requestquote:RequestquoteService) {
    this._countrymodel.getCountrycode()
    .subscribe(data => this.country = data ,
               error => this.errorMsg = error);
   }

  ngOnInit() {
  }
  login=this.fb.group({
    memberid:['',[Validators.required]],
    password:['',[Validators.required]],
    recaptchaReactive:[''],
  });
  resolved(captchaResponse: string) {
    this.cresponse=captchaResponse;
}
  selectedcountry: string = '';
  selectedstates:string='';
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
  log()
  {
    this.login.markAllAsTouched();
    if(this.login.valid)
    {
        const formData = new FormData();
        formData.append('secret',"6LethuEUAAAAAE3voxAK5xrSLMNghfsVcjY7ezsV");
        formData.append('response',this.cresponse);
        this._requestquote.captchacheck(formData).subscribe(response=>{
              if(response.success)
              {
                const formData = new FormData();
                formData.append('memberid',this.login.value.memberid);
                formData.append('password',this.login.value.password);
                formData.append('registrationtype',"JoinNow");
                this.SocialloginService.verifyuser(formData).subscribe((res: any) => {
                
                  if(res.success)
                  {
                      Swal.fire("loggedin");
                  }
                  else
                  {
                    Swal.fire("error");
                  }
                })
              }
              else
              {
                Swal.fire(
                  response.message,
                'error',
              );
              }
          
        })
      }
  }
  google()
  {
    this.OAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(async (socialusers) => { 
      const formData = new FormData();
      formData.append('id',socialusers.id);
      formData.append('name',socialusers.name); 
      formData.append('oauthprovider',socialusers.provider);
      formData.append('registrationtype',"socialmedia");
      this.SocialloginService.verifyuser(formData).subscribe((res: any) => {
            if(res.success)
            {
                Swal.fire("loggedin");
            }
            else
            {
              Swal.fire("error");
            }
      }) 
    }) 
  }
  facebook()
  {
    this.OAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(async (socialusers) => { 
      const formData = new FormData();
      formData.append('id',socialusers.id);
      formData.append('name',socialusers.name); 
      formData.append('oauthprovider',socialusers.provider);
      formData.append('registrationtype',"socialmedia");
      this.SocialloginService.verifyuser(formData).subscribe((res: any) => {
        if(res.success)
        {
            Swal.fire("loggedin");
        }
        else
        {
          Swal.fire("error");
        }
      })  
    })
  }
}
