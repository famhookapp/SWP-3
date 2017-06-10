import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { AuthenticationService } from '../CommonServices/authentication.service';
import { AlertService } from '../CommonServices/alert.service';
import { ConfigurationData } from '../CommonServices/configuration.model';
import { SharedServiceGM } from '../CommonServices/shared.service';
import { GlobalMessages } from '../CommonServices/messages.model';

@Component({
    moduleId: module.id,
    templateUrl: 'changepassword.component.html',
})
export class ChangePassword implements OnInit, OnDestroy {
    model: any = {};
    private sub: any;
    private token: string;
    private emailId: string;
    constructor(private authService: AuthenticationService,
        private alert: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private sharedServe: SharedServiceGM) {
        this.model.isResetPassword = false;
    }

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            this.emailId = params['email'];

            console.log(this.token, this.emailId);
        });
    }
    CancelClick() {
        this.router.navigate(['/login']);
    }

    forgotPasswordEmail(formObj) {
        if (formObj.valid && this.model.isValidPassword && this.model.isValidConfirmPassword) {
            this.authService.confirmPasswordChange(this.emailId, this.token, this.model.password).subscribe(result => {
                if (result) {
                    if (result.status == ConfigurationData.errorStatus) {
                        this.alert.error(result.message);
                        this.model.isResetPassword = false;
                    }
                    else {
                        this.alert.success(result.message);
                        this.model.isResetPassword = true;
                    }
                }
            });
        }
    }

    validatePassword() {
        this.model.isValidPassword = true;

        if (this.model.password) {
            var pwdLength = this.model.password.length;
            if (pwdLength < 8 || pwdLength > 12) {
                this.model.isValidPassword = false;
            }
            else {
                this.model.isValidPassword = true;
            }
        }
    }

    validateConfirmPassword() {
        this.model.isValidConfirmPassword = true;
        if (this.model.password == this.model.confirmpassword) {
            this.model.isValidConfirmPassword = true;
        }
        else {
            this.model.isValidConfirmPassword = false;
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}