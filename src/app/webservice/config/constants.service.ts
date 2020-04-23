import { Injectable,Input,Output,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  @Output() fire: EventEmitter<any> = new EventEmitter();

  constructor() { 
    console.log('change started'); 
     this.fire.emit(true);
  }
  getEmittedValue() {
    return this.fire;
  }
}
