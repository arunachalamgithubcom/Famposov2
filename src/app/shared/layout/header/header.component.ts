import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../webservice/category/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   public category=[];
   public subcategory=[];
  errorMsg: any;
  constructor(private _category:CategoryService) { }
   
  ngOnInit() {
     this._category.getcategory().subscribe(res=>this.category=res.data,
      error => this.errorMsg = error);
     this._category.getsubcategory().subscribe(res=>this.subcategory=res.data ,
      error => this.errorMsg = error);
  }

}

