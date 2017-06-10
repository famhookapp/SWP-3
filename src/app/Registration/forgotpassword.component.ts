import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {CookieService, CookieOptionsArgs} from 'angular2-cookie/core';

import { AuthenticationService } from '../CommonServices/authentication.service';
import { AlertService } from '../CommonServices/alert.service';
import { ConfigurationData } from '../CommonServices/configuration.model';
import { SharedServiceGM } from '../CommonServices/shared.service';
import { GlobalMessages } from '../CommonServices/messages.model';

@Component({
    moduleId: module.id,
    templateUrl: 'forgotpassword.component.html',    
})
export class ForgotPassword {
     model: any = {};     
     constructor(private authService: AuthenticationService,
        private alert: AlertService,
        private router: Router,
        private sharedServe: SharedServiceGM) {
            this.model.isResetPassword = false;
        }

     CancelClick() {
        this.router.navigate(['/login']);
    }

    forgotPasswordEmail(){
        this.authService.forgotPassword(this.model.username).subscribe(result =>{
            if(result)
            {
               if (result.status == ConfigurationData.errorStatus) {
                    this.alert.error(result.message);
                    this.model.isResetPassword = false;
                }
                else
                {
                    this.alert.success(result.message);
                    this.model.isResetPassword = true;
                }
            }
        });
    }

    /**Valid the email id is correct. Also, check if the email already exists in the DB. */
    validateEmailId() {
        var emailField = this.model.username;

        this.model.isValidEmail = true;
        this.model.isUserExist = false;
        if (emailField) {
            var atpos = emailField.indexOf("@");
            var dotpos = emailField.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailField.length) {
                this.model.isValidEmail = false;
            }
        }
        this.authService.checkUserExists(this.model.username).subscribe(result => {
            if (result.status == ConfigurationData.errorStatus) {
                this.model.isUserExist = true;                
            }
            else {
                this.model.isUserExist = false;
            }
        });
    }
}