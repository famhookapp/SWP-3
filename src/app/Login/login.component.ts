import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../CommonServices/authentication.service';
import { AlertService } from '../CommonServices/alert.service';
import { ConfigurationData } from '../CommonServices/configuration.model';
import { SharedServiceGM } from '../CommonServices/shared.service';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    returnUrl: any = {};
    loading = false;
    model: any = {};
    loadingPage:boolean = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private alert: AlertService,
        private sharedServe: SharedServiceGM
    ) {
        this.sharedServe.isLoginPage = true;
    }

    ngOnInit() {

        this.authService.logout();
        this.model.passwordLengthError = false;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/fullhouse';
    }

    login() {
        this.loading = true;
        this.loadingPage = true;
        this.authService.authenticateUser(this.model.username, this.model.password).subscribe(            
            data => {
                if (data && data.status == ConfigurationData.errorStatus) {
                    this.alert.error(data.message);
                }
                else {
                    this.sharedServe.setCellNo(data.details.cellno);
                    if(data.details.ismobverified)
                    {
                        this.sharedServe.isLoginPage = false;
                        this.router.navigate([this.returnUrl]);
                    }
                    else
                    {
                        this.router.navigate(['/mobverify']);
                    }
                    
                }
                this.loadingPage = false;
            },
            error => {
                if(error && error._body)
                {
                    let errMsg = JSON.parse(error._body).message;
                    this.alert.error(errMsg);
                    this.loading = false;
                }
                this.loadingPage = false;
            });
    }

    validateEmailId() {
        var emailField = this.model.username;

        this.model.isValidEmail = true;
        if (emailField) {
            var atpos = emailField.indexOf("@");
            var dotpos = emailField.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailField.length) {
                this.model.isValidEmail = false;
            }
        }
    }    

    validatePasswordLength() {
        if (this.model.password) {
            var pwdLength = this.model.password.length;
            if (pwdLength < 6 || pwdLength > 12) {
                this.model.passwordLengthError = true;
            }
            else {
                this.model.passwordLengthError = false;
            }
        }
    }
}