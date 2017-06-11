import { Component, OnInit,ViewChild, AfterViewInit, ElementRef, Renderer, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {CookieService, CookieOptionsArgs} from 'angular2-cookie/core';

import { AuthenticationService } from '../CommonServices/authentication.service';
import { AlertService } from '../CommonServices/alert.service';
import { ConfigurationData } from '../CommonServices/configuration.model';
import { SharedServiceGM } from '../CommonServices/shared.service';
import { GlobalMessages } from '../CommonServices/messages.model';
import { UserModel } from '../UserInfo/user.model';
import {DmFocusDirective} from '../SharedComponents/focus.directive';

@Component({
    moduleId: module.id,
    templateUrl: 'mobverification.component.html',    
})
export class MobileVerificationComponent implements AfterViewInit {
    model:any = {};    
    focusme1:boolean = true;
    focusme3:boolean = false;

    @ViewChild('number2') input1ElementRef;

     private cookieOption: CookieOptionsArgs = {};
    constructor(private el: ElementRef, 
    private authService: AuthenticationService,
    private alert: AlertService,private router: Router,
    private sharedServe:SharedServiceGM,
    private cookieServe:CookieService,
    private _ngZone: NgZone
    ){}
    validateCode(event) {
        var k = event.keyCode;
        /* numeric inputs can come from the keypad or the numeric row at the top */
        if ( (k < 48 || k > 57) && (k < 96 || k > 105)) {
            event.preventDefault();
            return false;
        }
        console.log(event, event.keyCode, event.keyIdentifier);
    } 

    ngAfterViewInit() {       
        this.model.cellnumber = this.sharedServe.getCellNo();         
        if(!this.model.cellnumber)
        {
            this.router.navigate(['/login']);
        }
        document.getElementById("number1").focus();
        let textObj = this.el.nativeElement.querySelector('#number1');
        textObj.focus();

        this.alert.error("You are successfully registered. Please verify your mobile number for smooth shopping.");       
        
    }
    validateAndMoveFocus(event, nextCtrlName){
        var allValuesAvailable = false;
        if(this.model.number1.trim() && this.model.number2.trim() && this.model.number3.trim() && this.model.number4.trim())
        {
            var allValuesAvailable = true;
        }
        
        if(!allValuesAvailable || isNaN(this.model.number1) || isNaN(this.model.number2) || isNaN(this.model.number3) || isNaN(this.model.number4))
        {
            this.model.isCodeNaN = true;
        }           
        else
        {
            this.model.isCodeNaN = false;
        }
        let finalCode = this.model.number1 + '' + this.model.number2 + '' + this.model.number3 + '' + this.model.number4;
        
        this._ngZone.runOutsideAngular(() => { 
            setTimeout(() => this.setFocus(nextCtrlName), 0);
        });   
    }

    setFocus(elementRef) {
        if(elementRef)
        {
            document.getElementById(elementRef).focus();
        }        
    }       
    validateMobilenumber() {
        var phoneno = /^\d{10}$/;
        this.model.isValidMobile = true;
        if (this.model.cellnumber.match(phoneno)) {
            this.model.isValidMobile = true;
        }
        else {
            this.model.isValidMobile = false;
        }
    }
    verifyMobCode()
    {   
        var allValuesAvailable = false;
        if(this.model.number1.trim() && this.model.number2.trim() && this.model.number3.trim() && this.model.number4.trim())
        {
            var allValuesAvailable = true;
        }
        
        if(!allValuesAvailable || isNaN(this.model.number1) || isNaN(this.model.number2) || isNaN(this.model.number3) || isNaN(this.model.number4))
        {
            this.model.isCodeNaN = true;
        }           
        else
        {
            this.model.isCodeNaN = false;
        }

        if(!this.model.isCodeNaN)
        {
            let finalCode = this.model.number1 + '' + this.model.number2 + '' + this.model.number3 + '' + this.model.number4;
            this.authService.verifyMobile(finalCode).subscribe(result => {
                if(result)
                {
                    if(result.status == ConfigurationData.errorStatus)
                    {                        
                        this.alert.error(result.message);
                    }
                    else if(result.status == "tokerror")
                    {
                        this.router.navigate(['/login']);                     
                    }
                    else
                    {
                        this.alert.success(result.message);
                        var cookieDate = new Date();
                        cookieDate.setDate(cookieDate.getDate() + 1);
                        this.cookieOption.expires = cookieDate; 
                        let currentCookieDetails = this.cookieServe.get(ConfigurationData.currentUserDetails);
                        let userObj = JSON.parse(currentCookieDetails);                        
                        userObj.ismobverified = true;
                        this.cookieServe.put(ConfigurationData.currentUserDetails, JSON.stringify(userObj), this.cookieOption);
                        setTimeout(()=> {
                            this.router.navigate(['/fullhouse']); 
                        }, 2000);
                    }
                }                
            });
        }        
    }

    resendCode(){        
        this.authService.regenerateMobCode(this.model.cellnumber).subscribe(result => {
            if(result)
            {
                if(result.status == ConfigurationData.errorStatus)
                {                        
                    this.alert.error(result.message);
                }              
                else
                {
                    this.model.number1 = '';
                    this.model.number2 = '';
                    this.model.number3 = '';
                    this.model.number4 = '';
                    this.alert.success(result.message);
                }
            }                
        });                
    }
}