import {Component, OnInit} from  '@angular/core';
import {AlertService} from '../../CommonServices/alert.service';

@Component({
    moduleId:module.id,
    selector:'alert-flash',
    templateUrl:'alert.component.html'
})
export class AlertComponent{
    message:any;

    constructor(private alertserve:AlertService){}

    ngOnInit(){
        this.alertserve.getMessage().subscribe(message => {this.message = message;});
    }
}