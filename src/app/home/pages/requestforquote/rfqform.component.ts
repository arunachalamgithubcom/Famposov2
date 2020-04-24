import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {enGbLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService, defineLocale} from 'ngx-bootstrap';

import { CountryService } from '../../../webservice/location/country.service';
import { RequestquoteService } from '../../../webservice/requestforquote/requestquote.service';
import { ValidationService } from '../../../webservice/validation/validation.service';


@Component({
  selector: 'app-rfqform',
  templateUrl: './rfqform.component.html',
  styleUrls: ['./rfqform.component.css']
})
export class RfqformComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  submitted = false;

  public country=[];
  public states=[];
  public cities=[];
  public phonecode=[
   {"phonecode":"Ac"},
  ];
  public submitval='';
  public errorMsg;
  public rfqmodetype='';
  public response='';
  public btval='Proceed';
  public reference_no='';
  public isDisabled=false;
  public DisDisabled=false;
  minDate: Date;
  maxDate: Date;
  public rfqtype='';
  show_referencebox=false;
  public show_locationbox=false;
  public rfqdata=[];
  public headval="";
  public isEnabled;
  public testloc="Other location";
 
  constructor(private localeService: BsLocaleService,private spinner: NgxSpinnerService,private _countrymodel:CountryService,private  router: Router, private location: Location,private fb: FormBuilder,private _requestquote:RequestquoteService,private _validation:ValidationService) 
   {
    enGbLocale.invalidDate = 'Select date';
    defineLocale('custom locale', enGbLocale); 
    this.localeService.use('custom locale');
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      });
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this._countrymodel.getCountrycode()
    .subscribe(data => this.country = data ,
               error => this.errorMsg = error);
             
    
             
   }
   requestquoteform=this.fb.group({
    rfqtype:[''],
    reference_no:[''],
    company_url:[''],
    product_name:['',[Validators.required]],
    product_details:['',[Validators.required]],
    dimension_length:[''],
    Dlunit:[''],
    dimension_width:[''],
    Dwunit:[''],
    quantity_min:[''],
    quantity_max:[''],
    weight_min:[''],
    Wlunit:[''],
    weight_max:[''],
    Wwunit:[''],
    buying_currency:[''],
    buyprice_min:[''],
    buyprice_max:[''],
    delivery:[''],
    expected_delivery_date:[''],
    by_date:[''],
    Other_location:[''],
    customer_name:['',[Validators.required]],
    email:['',[Validators.required, ValidationService.emailValidator]],
    company_name:[''],
    country:['',Validators.required],
    countrycode:[''],
    state:[''],
    city:[''],
    postal_code:[''],
    mobile_no:['',[Validators.required,ValidationService.numberValidator]]
  },{ validator:[ValidationService.WeightValidator,ValidationService.QuantityValidator,ValidationService.PriceRangeValidator,ValidationService.DateRangeValidator,ValidationService.urlValidator,ValidationService. PhoneLengthValidator]});
  ngOnInit() {

        this.requestquoteform.patchValue({Wlunit:'null'});
        this.requestquoteform.patchValue({Wwunit:'null'});
        this.requestquoteform.patchValue({Dlunit:'null'});
        this.requestquoteform.patchValue({Dwunit:'null'});
        this.requestquoteform.patchValue({buying_currency:'NULL'});
    console.log('state >>>', history.state);
    console.log('location >>>', this.location.getState());
  
    if(this.rfqmodetype=="post")
    {
      this.isDisabled=false;
      this.DisDisabled=false;
      
    }  
    
    const val: any = this.location.getState();
    const keys:any = Object.keys(val);
    this.rfqmodetype=val['rfqmodetype'];
    this.reference_no=val['reference_no'];
    this.rfqtype=val['rfqtype'];
     
    if(val['rfqtype']=="BUY")
    {

        this.headval="buy";
    }
    if(val['rfqtype']=="RENT")
    {
       this.headval="rent";
    }
    if(val['rfqtype']=="OPS")
    {
       this.headval="opensale";
    }
    if(val['rfqtype']=="RFQ")
    {
       this.headval="requestforquote";
    }
    if(this.rfqmodetype=="edit" || this.rfqmodetype=="delete")
    {
      this._countrymodel.getphonecode(this.reference_no)
    .subscribe(data => this.phonecode = data ,
    error => this.errorMsg = error);
      this._countrymodel.getAllstates(this.reference_no)
      .subscribe(data => this.states = data ,
        error => this.errorMsg = error);
      this._countrymodel.getAllcity(this.reference_no)
      .subscribe(data => this.cities = data ,
       error => this.errorMsg = error);    
      if(this.rfqmodetype=="delete")
      {
        
        this.isDisabled=true;
        this.DisDisabled=true;
      }
      if(this.rfqmodetype=="edit")
      {
        this.isDisabled=true;
        this.headval="edit";
      }
       this.show_referencebox=true;
       if(this.rfqmodetype=="delete")
       {
          this.btval="Delete";
          this.headval="delete";
         
       }
       
       const formData = new FormData();
       formData.append('Refer_no',this.reference_no);
       this._requestquote.getRfqdata(formData)
     .subscribe(response=>{
    this.requestquoteform.patchValue(response.data[0]);if(response.data[0].Other_location !="true" && response.data[0].Other_location!="false")
    {
          this.isEnabled=false;   
    }else
    {
       this.show_locationbox=true;
      
       this.requestquoteform.patchValue({Other_location:'Other location'});
    };if(response.data[0].Dwunit=="NULL")
    {
     
      this.requestquoteform.patchValue({Dwunit:'null'});
    };if(response.data[0].Dlunit=="NULL")
    {
      
      this.requestquoteform.patchValue({Dlunit:'null'});
    };if(response.data[0].Wwunit=="NULL" )
    {
      
      this.requestquoteform.patchValue({Wwunit:'null'});
    };if(response.data[0].Wlunit=="NULL")
    {
      this.requestquoteform.patchValue({Wlunit:'null'});
    }
  },
  error=>console.error('error',error));
    }
   
    if(this.rfqmodetype=="post")
    {
      this.isDisabled=false;
      this.DisDisabled=false;
    }
    if(this.rfqmodetype=="")
    {
      console.log("test");
     this.router.navigate(['home']);
    }
    keys.forEach(key => {
      if (this.requestquoteform.controls[key]) {
        this.requestquoteform.controls[key].setValue(val[key]);
      }
      });
     
  }
  dimensionunit= [
    {"unit": "Mm" }, 
    {"unit": "Cm" }, 
    {"unit": "Inch"}
  ]
  weightunit= [
    {"unit": "Gram" }, 
    {"unit": "Kg" }, 
    {"unit": "Ton"}
  ]
  selectedcountry: string = '';
  selectedstates:string='';
  selectD1 (event: any) 
  {
    const selectDl = event.target;
    const val = selectDl.options[selectDl.selectedIndex].getAttribute('data-somedata');
    this.requestquoteform.patchValue({Dwunit:val});
  }
  selectD2 (event: any) 
  {
    const selectD2 = event.target;
    const val = selectD2.options[selectD2.selectedIndex].getAttribute('data-somedata');
    this.requestquoteform.patchValue({Dlunit:val});
  }
  selectW1(event: any) 
  {
  
    const selectWl = event.target;
    const val = selectWl.options[selectWl.selectedIndex].getAttribute('data-somedata');
    this.requestquoteform.patchValue({Wwunit:val});
  }
  selectW2 (event: any) 
  {
    const selectW2 = event.target;
    const val = selectW2.options[selectW2.selectedIndex].getAttribute('data-somedata');
    this.requestquoteform.patchValue({Wlunit:val});
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
  selectChangeStates (event: any) 
  {
    this.selectedstates = event.target.value;
    const selectEl = event.target;
    const val = selectEl.options[selectEl.selectedIndex].getAttribute('data-somedata');
    this._countrymodel.getCity(val)
    .subscribe(data => this.cities = data ,
      error => this.errorMsg = error);
  }
  handleSelected($event)
  {
      if ($event.target.checked === true) {
        
        this.show_locationbox=true;
        this.testloc="Other location";
       
      }
      else
      {
        this.show_locationbox=false;
        this.testloc="Other location";
      }
  }
  onSubmit()
  {  

    if(this.requestquoteform.controls['product_name'].valid)
    {
      if(this.requestquoteform.controls['product_details'].valid)
    { 
        if(this.requestquoteform.controls['customer_name'].valid)
        {
          if(this.requestquoteform.controls['email'].valid)
          {
          
              if(this.requestquoteform.controls['country'].valid)
              {
                
              if(this.requestquoteform.controls['mobile_no'].valid)
              {
                  this.submitted = true;
                  var exdatestr = (new Date(this.requestquoteform.value.expected_delivery_date)).toLocaleDateString();
                  var bydatestr = (new Date(this.requestquoteform.value.by_date)).toLocaleDateString();
                
                  if(this.rfqmodetype=="edit")
                  {
                    this.spinner.show();       
                    this.requestquoteform.markAllAsTouched();
                    if (this.requestquoteform.valid) {
                    console.log("edit");
                    const formData = new FormData();
                    formData.append('rfqtype', this.requestquoteform.value.rfqtype);
                    formData.append('reference_no', this.requestquoteform.value.reference_no);
                    formData.append('product_name', this.requestquoteform.value.product_name);
                    formData.append('product_details', this.requestquoteform.value.product_details);
                    formData.append('dimension_length', this.requestquoteform.value.dimension_length);
                    formData.append('Dlunit', this.requestquoteform.value.Dlunit);
                    formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                    formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                    formData.append('quantity_min', this.requestquoteform.value.quantity_min);
                    formData.append('quantity_max', this.requestquoteform.value.quantity_max);
                    formData.append('weight_min', this.requestquoteform.value.weight_min);
                    formData.append('Wlunit', this.requestquoteform.value.Wlunit);
                    formData.append('weight_max', this.requestquoteform.value.weight_max);
                    formData.append('Wwunit', this.requestquoteform.value.Wwunit);
                    formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                    formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                    formData.append('buying_currency', this.requestquoteform.value.buying_currency);
                    formData.append('buyprice_min', this.requestquoteform.value.buyprice_min);
                    formData.append('buyprice_max', this.requestquoteform.value.buyprice_max);
                    formData.append('delivery', this.requestquoteform.value.delivery);
                    formData.append('expected_delivery_date',exdatestr);
                    formData.append('by_date',bydatestr);
                    formData.append('Other_location', this.requestquoteform.value.Other_location);
                    formData.append('customer_name', this.requestquoteform.value.customer_name);
                    formData.append('email', this.requestquoteform.value.email);
                    formData.append('company_name', this.requestquoteform.value.company_name);
                    formData.append('country', this.requestquoteform.value.country);
                    formData.append('delivery', this.requestquoteform.value.delivery);
                    formData.append('state', this.requestquoteform.value.state);
                    formData.append('city', this.requestquoteform.value.city);
                    formData.append('postal_code', this.requestquoteform.value.postal_code);
                    formData.append('country', this.requestquoteform.value.country);
                    formData.append('mobile_no', this.requestquoteform.value.mobile_no);
                    formData.append('countrycode', this.requestquoteform.value.countrycode);
                    formData.append('company_url', this.requestquoteform.value.company_url);
                    this._requestquote.rfqedit(formData).subscribe(response=>{this.spinner.hide();
                      if(response.success)
                      {
                        Swal.fire({
                          allowOutsideClick:false,
                          title: 'Given Details are Updated successfully \n We have sent a confirmation to your given email \n Thank you',
                          width: 600,                        }).then((result) => {
                      if(result.value)
                      {
                          this.router.navigate(['home']);
                      }
                    })
                  }
                  else
                {
                  Swal.fire(
                      
                    response.message,
                )
                }},error=>console.error('error',error));
                  
                    }
                    else
                    {
                      this.spinner.hide();
                      
                      this.submitted=false;
                      return;
                    }
                  }
                  else if(this.rfqmodetype=="delete")
                  {
                    console.log("delete");
                    const formData = new FormData();
                    formData.append('rfqtype', this.requestquoteform.value.rfqtype);
                    formData.append('reference_no', this.requestquoteform.value.reference_no);
                    formData.append('product_name', this.requestquoteform.value.product_name);
                    formData.append('product_details', this.requestquoteform.value.product_details);
                    formData.append('dimension_length', this.requestquoteform.value.dimension_length);
                    formData.append('Dlunit', this.requestquoteform.value.Dlunit);
                    formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                    formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                    formData.append('quantity_min', this.requestquoteform.value.quantity_min);
                    formData.append('quantity_max', this.requestquoteform.value.quantity_max);
                    formData.append('weight_min', this.requestquoteform.value.weight_min);
                    formData.append('Wlunit', this.requestquoteform.value.Wlunit);
                    formData.append('weight_max', this.requestquoteform.value.weight_max);
                    formData.append('Wwunit', this.requestquoteform.value.Wwunit);
                    formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                    formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                    formData.append('buying_currency', this.requestquoteform.value.buying_currency);
                    formData.append('buyprice_min', this.requestquoteform.value.buyprice_min);
                    formData.append('buyprice_max', this.requestquoteform.value.buyprice_max);
                    formData.append('delivery', this.requestquoteform.value.delivery);
                    formData.append('expected_delivery_date',exdatestr);
                    formData.append('by_date',bydatestr);
                    formData.append('Other_location', this.requestquoteform.value.Other_location);
                    formData.append('customer_name', this.requestquoteform.value.customer_name);
                    formData.append('email', this.requestquoteform.value.email);
                    formData.append('company_name', this.requestquoteform.value.company_name);
                    formData.append('country', this.requestquoteform.value.country);
                    formData.append('delivery', this.requestquoteform.value.delivery);
                    formData.append('state', this.requestquoteform.value.state);
                    formData.append('city', this.requestquoteform.value.city);
                    formData.append('postal_code', this.requestquoteform.value.postal_code);
                    formData.append('country', this.requestquoteform.value.country);
                    formData.append('mobile_no', this.requestquoteform.value.mobile_no);
                    formData.append('countrycode', this.requestquoteform.value.countrycode);
                    formData.append('company_url', this.requestquoteform.value.company_url);
                    Swal.fire({
                      icon: 'warning',
                      title: 'Are you sure?',
                      titleText:"Are you sure to delete ?",
                      showCancelButton: true,
                      cancelButtonColor: 'red',
                      confirmButtonText:
                        'Yes',
                      confirmButtonAriaLabel: 'Yes',
                      cancelButtonText:
                        'No',
                      cancelButtonAriaLabel: 'No'
                    }).then((result) => {
                      if(result.value)
                      {
                        this.spinner.show();            
                              this._requestquote.rfqdelete(formData).subscribe(response=>{this.spinner.hide();if(response.success)
                                {
                                  Swal.fire({
                                    allowOutsideClick:false,
                                    title: 'Famposo team received your request!\n  Your RFQ is Deleted successfully \n We have sent a confirmation to your given email \n Thank you',
                                 width:600,
                                  }).then((result) => {
                                if(result.value)
                                {
                                  this.router.navigate(['home']);
                                }
                              })
                            }
                            else
                          {
                            Swal.fire(
                                
                                response.message,
                                'error',
                              )
                          }},error=>console.error('error',error));
                      }
                    });
          
                  }
                  else
                  {
                    this.spinner.show();    
                    this.requestquoteform.markAllAsTouched();
                    if (this.requestquoteform.valid) {
                      console.log("post");
                      const formData = new FormData();
                    
                      formData.append('rfqtype', this.requestquoteform.value.rfqtype);
                      formData.append('product_name', this.requestquoteform.value.product_name);
                      formData.append('product_details', this.requestquoteform.value.product_details);
                      formData.append('dimension_length', this.requestquoteform.value.dimension_length);
                      formData.append('Dlunit', this.requestquoteform.value.Dlunit);
                      formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                      formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                      formData.append('quantity_min', this.requestquoteform.value.quantity_min);
                      formData.append('quantity_max', this.requestquoteform.value.quantity_max);
                      formData.append('weight_min', this.requestquoteform.value.weight_min);
                      formData.append('Wlunit', this.requestquoteform.value.Wlunit);
                      formData.append('weight_max', this.requestquoteform.value.weight_max);
                      formData.append('Wwunit', this.requestquoteform.value.Wwunit);
                      formData.append('dimension_width', this.requestquoteform.value.dimension_width);
                      formData.append('Dwunit', this.requestquoteform.value.Dwunit);
                      formData.append('buying_currency', this.requestquoteform.value.buying_currency);
                      formData.append('buyprice_min', this.requestquoteform.value.buyprice_min);
                      formData.append('buyprice_max', this.requestquoteform.value.buyprice_max);
                      formData.append('delivery', this.requestquoteform.value.delivery);
                      formData.append('expected_delivery_date',exdatestr);
                      formData.append('by_date',bydatestr);
                      formData.append('Other_location', this.requestquoteform.value.Other_location);
                      formData.append('customer_name', this.requestquoteform.value.customer_name);
                      formData.append('email', this.requestquoteform.value.email);
                      formData.append('company_name', this.requestquoteform.value.company_name);
                      formData.append('country', this.requestquoteform.value.country);
                      formData.append('delivery', this.requestquoteform.value.delivery);
                      formData.append('state', this.requestquoteform.value.state);
                      formData.append('city', this.requestquoteform.value.city);
                      formData.append('postal_code', this.requestquoteform.value.postal_code);
                      formData.append('country', this.requestquoteform.value.country);
                      formData.append('mobile_no', this.requestquoteform.value.mobile_no);
                      formData.append('countrycode', this.requestquoteform.value.countrycode);
                      formData.append('company_url', this.requestquoteform.value.company_url);
                      this._requestquote.rfqpost(formData).subscribe(response=>{this.spinner.hide();if(response.success)
                        {
                          Swal.fire({
                            title: 'Famposo team received your request!',
                            titleText:'Famposo team received your request!\n Reference_no   '+response.reference_no+'\n We have sent a confirmation to your given email \n Thank you',
                            width: 600,
                            allowOutsideClick:false,
                                                    }).then((result) => {
                        if(result.value)
                        {
                          this.router.navigate(['home']);
                        }
                      })
                    }else
                  {
                    Swal.fire(
                      
                      response.message,
                      'error',
                    )
                  }
                },error=>console.error('error',error));
                    }
                    else
                    {
                      this.spinner.hide();
                      
                      this.submitted=false;
                      return;
                    }
                  }
                }
                else
                {
                  Swal.fire("Phone no is required");
                }
                }
                else
                {
                     Swal.fire("Country  is required");
                }
               }
               else
               {
                     Swal.fire("Email  is required");
               }
             }
             else
             {
                  Swal.fire("Customer name is required");
             }
          }
          else
          {
               Swal.fire("Product details is required");
          }
        }
        else
        {
            Swal.fire("Product name is required");
        }

  }
 

}
