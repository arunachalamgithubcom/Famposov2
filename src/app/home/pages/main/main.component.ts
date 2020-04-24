import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { RequestquoteService } from '../../../webservice/requestforquote/requestquote.service';
import { ValidationService } from '../../../webservice/validation/validation.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  selectedmode: string = '';
  
  show_name_email=true;
  show_referencebox=false;
  cresponse:any;
  public reference_novalid:any;
  contentEditable: boolean;
 
  constructor(private router:Router,private _requestquote:RequestquoteService) { }

  ngOnInit() {
    
  }
  RfqFormMain=new FormGroup({
    rfqtype:new FormControl('',Validators.required),
    rfqmodetype:new FormControl('',Validators.required),
    customer_name:new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required,ValidationService.emailValidator]),
    reference_no:new FormControl('',Validators.required),
    recaptchaReactive:new FormControl('',Validators.required),
    agree:new FormControl('',Validators.required)
  });
 
  selectmodeHandler(event: any) 
  {
    
    this.selectedmode = event.target.value;
    console.log(this.selectedmode);
    
    if(this.selectedmode=="delete" || this.selectedmode=="edit")
    {
      
      this.show_name_email=false;
      this.show_referencebox=true;
    }
    else
    {
    
      this.show_name_email=true;
      this.show_referencebox=false;
    }
  }

  toggleEditable(event:any) {
     if ( event.target.checked ) {
         this.contentEditable = true;
         console.log("true");
    }
    else
    {
      this.contentEditable = false;
      console.log("false");
    }
}
  resolved(captchaResponse: string) {
    this.cresponse=captchaResponse;
}
  rfqdata()
  {
        console.log("post");
        this.RfqFormMain.markAllAsTouched();
       
      if(this.RfqFormMain.controls['rfqtype'].valid)
      {   
        if(this.RfqFormMain.controls['rfqmodetype'].valid)
        {
        if(this.RfqFormMain.controls['rfqmodetype'].value=="post")
        {
          
            if(this.RfqFormMain.controls['customer_name'].valid && this.RfqFormMain.controls['email'].valid)
            {
              const formData = new FormData();
              formData.append('secret',"6LethuEUAAAAAE3voxAK5xrSLMNghfsVcjY7ezsV");
              formData.append('response',this.cresponse);
              this._requestquote.captchacheck(formData).subscribe(response=>{
                if(response.success)
                {
     
                  if(this.RfqFormMain.controls['agree'].valid && this.contentEditable==true)
                  {
                       const formData = new FormData();
                       formData.append('customer_name',this.RfqFormMain.value.customer_name);
                       formData.append('email',this.RfqFormMain.value.email);
                       formData.append('rfqmode',this.RfqFormMain.value.rfqmodetype);
                       this._requestquote.rfqpostcheck(formData).subscribe(response=>{
                        if(response.success)
                        {
             
                               this.router.navigate(['requestforquote'],{ state: this.RfqFormMain.value});
                           
                        }
                        else
                        { 
                          Swal.fire(
                             response.message,
                            'error',
                          );
                        }
                       },error=>console.error('error',error));
                  }
                  else
                  {
                    Swal.fire('Kindly agree with famposo terms and conditions');
                  } 
               
              
                   
                }
                else
                { 
                  Swal.fire("kindly Verify the captcha");
                }
               },error=>console.error('error',error));
                

            
            }
            else
            {
             Swal.fire('Provide a valid Customer Name or Email ');
              
            }        

        }
        else if(this.RfqFormMain.controls['rfqmodetype'].value=="edit" || this.RfqFormMain.controls['rfqmodetype'].value=="delete")
        {
          if(this.RfqFormMain.controls['reference_no'].valid)
          {
            const formData = new FormData();
            formData.append('reference_no',this.RfqFormMain.value.reference_no);
            formData.append('rfqtype',this.RfqFormMain.value.rfqtype);
            formData.append('rfqmode',this.RfqFormMain.value.rfqmodetype);
            this._requestquote.rfqcheck(formData).subscribe(response=>{
             if(response.success)
             {
              const formData = new FormData();
              formData.append('secret',"6LethuEUAAAAAE3voxAK5xrSLMNghfsVcjY7ezsV");
              formData.append('response',this.cresponse);
              this._requestquote.captchacheck(formData).subscribe(response=>{
                if(response.success)
                {
     
                  if(this.RfqFormMain.controls['agree'].valid && this.contentEditable==true)
                  {
                    this.router.navigate(['requestforquote'],{ state: this.RfqFormMain.value});
                  }
                  else
                  {
                    Swal.fire("Kindly agree with famposo terms and conditions");
                  }
              
                   
                }
                else
                { 
                  Swal.fire("Please Verify the captcha");
                }
               },error=>console.error('error',error));
                   
                
             }
             else
             { 
               Swal.fire(
                  response.message,
                 'error',
               );
             }
            },error=>console.error('error',error));
          }
          else
          {
            Swal.fire("Your Reference No is not Valid");
          } 
        }
        else
        {
          
          Swal.fire("Select Your RFQ Mode");
        }
      }
      else
      {
        Swal.fire("Select Your RFQ Mode");
      }
    }
    else
    {
       Swal.fire('Choose a given RFQ Type like \n Buy/Rent/Opensale/Requestquote');
    }
    
  }
}
