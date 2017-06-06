import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SharedServiceGM} from './CommonServices/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html' 
})
export class AppComponent {
  title = 'app works!';
  constructor(private sharedServe:SharedServiceGM){    
    
  }

}
