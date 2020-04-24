import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/Http';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RecaptchaModule } from 'ng-recaptcha';
import { DynamiSocialLoginModule, AuthServiceConfig  } from "ng-dynami-social-login";
import { GoogleLoginProvider, FacebookLoginProvider,LinkedinLoginProvider } from "ng-dynami-social-login";
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule, routingHomeComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("31252165227-q07ip3caf0se4rnn60qhepj0gkqa8qjk.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("212376753535830")
  },
]);
 
export function provideConfig() {
  return config;
}
 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ValidationMessageComponent,
    routingHomeComponents
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RecaptchaModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    HttpClientModule,
    DynamiSocialLoginModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AppRoutingModule
  ],
  providers: [{provide: AuthServiceConfig,useFactory: provideConfig}],
  bootstrap: [AppComponent],
  entryComponents: [
    ValidationMessageComponent
  ]
})
export class AppModule { }
