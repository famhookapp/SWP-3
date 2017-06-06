import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';

import {ConfigurationData} from '../CommonServices/configuration.model';

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private router:Router,private cookieServe:CookieService){}
    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
        let currentUserInfo = this.cookieServe.get(ConfigurationData.currentUserName);
        if(currentUserInfo){
            return true;
        }

        this.router.navigate(['/login'], {queryParams:{returnUrl:state.url}});
        return false;
    }
}
