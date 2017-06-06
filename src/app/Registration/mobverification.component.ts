import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthenticationService } from '../CommonServices/authentication.service';
import { AlertService } from '../CommonServices/alert.service';
import { ConfigurationData } from '../CommonServices/configuration.model';
import { SharedServiceGM } from '../CommonServices/shared.service';
import { GlobalMessages } from '../CommonServices/messages.model';
import { UserModel } from '../UserInfo/user.model';

@Component({
    moduleId: module.id,
    templateUrl: 'mobverification.component.html'    
})
export class MobileVerificationComponent {}