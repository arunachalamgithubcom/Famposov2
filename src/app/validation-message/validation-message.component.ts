import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from '../webservice/validation/validation.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'validation-messages',
  template: `<div class="text-danger" *ngIf="errorMessage">{{errorMessage}}</div>`,
  styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() control: FormControl;
  get errorMessage() {
    for (let propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && (this.control.dirty || this.control.touched)) {
            return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
        }
    }

    return null;
}
}
