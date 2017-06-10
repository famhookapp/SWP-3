import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {CookieService, CookieOptionsArgs} from 'angular2-cookie/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {ConfigurationData} from './configuration.model';
import { UserModel } from '../UserInfo/user.model';
import {SharedServiceGM} from '../CommonServices/shared.service';

@Injectable()
export class AuthenticationService{

    private cookieOption: CookieOptionsArgs = {};

    constructor(private http: Http, 
    private cookieServe:CookieService,
    private sharedServe:SharedServiceGM){}
    //private authInfo: any = {};


    authenticateUser(userName:string, password:string){
        let authInfo = {uname:userName, doorkey:password};          
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/authuser', authInfo, options)
        .map((response : Response) => {
            let userInfo = response.json();
            if(userInfo.status == ConfigurationData.successStatus && userInfo.token)
            {
                //store the token info in session.
                //localStorage.setItem(ConfigurationData.currentUserName, userInfo.token);
                var cookieDate = new Date();
                cookieDate.setDate(cookieDate.getDate() + 1);
                this.cookieOption.expires = cookieDate;                 
                this.cookieServe.put(ConfigurationData.currentUserName, userInfo.token, this.cookieOption);
                let userInformation = {fname:userInfo.details.firstname,lname:userInfo.details.lastname,ismobverified:userInfo.details.ismobverified};
                this.cookieServe.put(ConfigurationData.currentUserDetails, JSON.stringify(userInformation), this.cookieOption);
            }
            return response.json();
        });
    }

    /**Check if the user email id is alrady registered. Parameter is email id / username */
    checkUserExists(userName:string){
        let authInfo = {uname:userName};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/checkEmail', authInfo, options)
        .map((response : Response) => {            
            return response.json();
        });
    }

    /**Register the user. Send user registration form info to this method. */
    addUserInfo(userObj:UserModel){
        //{"firstname":"test112334","lastname":"sdasdasd","uname":"schema126@mail.com","doorkey":"password","cityid":1,"stateid":1,"areaid":1,"mobile":"1234567893","mobilecode":"6512"}
        let authInfo = {firstname:userObj.firstName, lastname:userObj.lastName, uname:userObj.userName, doorkey:userObj.doorKey,
            address1:userObj.address1, address2:userObj.address2,areaid:userObj.areaid,cityid:userObj.cityid,stateid:userObj.stateid,mobile:userObj.mobileNo};          
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/putUserDetails', authInfo, options)
        .map((response : Response) => {
            let userInfo = response.json();                        
            if(userInfo.status == ConfigurationData.successStatus && userInfo.token)
            {
                //store the token info in session.
                //localStorage.setItem(ConfigurationData.currentUserName, userInfo.token);
                var cookieDate = new Date();
                cookieDate.setDate(cookieDate.getDate() + 1);
                this.cookieOption.expires = cookieDate;                 
                this.cookieServe.put(ConfigurationData.currentUserName, userInfo.token, this.cookieOption);
                this.cookieServe.put(ConfigurationData.currentUserDetails, JSON.stringify(userInfo.details), this.cookieOption);
            }
            return response.json();
        });
    }

    /**Verify the code sent on users mob */
    verifyMobile(code:string){
        var tokenKey = this.sharedServe.getTokenKey();

        let authInfo = {token:tokenKey, mobilecode:code};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/verifyMob', authInfo, options)
        .map((response : Response) => {            
            return response.json();
        });
    }

    /**Regenerate the mobile code. */
    regenerateMobCode(mobileNo){
        var tokenKey = this.sharedServe.getTokenKey();

        let authInfo = {mobile:mobileNo, token:tokenKey};  
        
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/regenerateMob', authInfo, options)
        .map((response : Response) => {            
            return response.json();
        });
    }

    /**Forgot password send email and generate validation code. */
    forgotPassword(emailId){        
        let authInfo = {email:emailId};  
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'member/forgotPass', authInfo, options)
        .map((response : Response) => {            
            return response.json();
        });
    }

    /**Confirm the new password and update the same */
    confirmPasswordChange(emailId,token,newpassword){
        let authInfo = {email:emailId, token:token, newpassword:newpassword};                  
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});
        return this.http.post(ConfigurationData.appBLURL + 'member/changePass', authInfo, options)
        .map((response : Response) => {            
            return response.json();
        });
    }

    logout(){
        localStorage.removeItem(ConfigurationData.currentUserName);
    }

    /**Get the list of states for India i.e. country id 1 - hardcoded*/
    getAllStates(){                   
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});
        var rawData = {countryid:1};
        return this.http.post(ConfigurationData.appBLURL + 'master/statelist', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    } 

    /**Get list of all cities for selected state*/
    getAllCities(stateId:number){                   
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});
        var rawData = {stateid:stateId};
        return this.http.post(ConfigurationData.appBLURL + 'master/citylist', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    }     

    /**Get list of all the areas for the selected city. */
    getAllAreas(cityId:number){                   
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});
        var rawData = {cityid:cityId};
        return this.http.post(ConfigurationData.appBLURL + 'master/arealist', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    }     
}