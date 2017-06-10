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
    templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    stateDisable = false;
    cityDisable = false;
    areaDisable = false;
    dropdownList = [];
    model: any = {};

    //Dropdown Data
    stateDropdownList = [];
    cityDropdownList = [];
    areaDropdownList = [];

    //Dropdown initial selected value
    citySelectedItems = [];
    stateSelectedItems = [];
    areaSelectedItems = [];

    //Setting for each dropdown
    dropdownSettings = {};
    stateDropdownSettings = {};
    cityDropdownSettings = {};
    areaDropdownSettings = {};
    userObj: UserModel;

    constructor(private authService: AuthenticationService,
        private alert: AlertService,
        private router: Router,
        private sharedServe: SharedServiceGM) {
        this.userObj = new UserModel();
    }
    ngOnInit() {
        //Set the basic properties of the dropdown.
        this.stateDropdownSettings = {
            singleSelection: true,
            text: "Select State",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "register-search-dropdown"
        };
        this.cityDropdownSettings = {
            singleSelection: true,
            text: "Select City",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "register-search-dropdown"
        };

        this.areaDropdownSettings = {
            singleSelection: true,
            text: "Select Area",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "register-search-dropdown"
        };

        this.getStateList();
    }

    /**Get list of State and bind it to the dropdown list array. Also set the selected value. */
    getStateList() {
        this.authService.getAllStates().subscribe(states => {

            let tempState = states.result;
            for (let stateObj of tempState) {
                if (stateObj.is_default) {
                    this.stateSelectedItems.push({ "id": stateObj.state_id, "itemName": stateObj.state_name });
                }
                this.stateDropdownList.push({ "id": stateObj.state_id, "itemName": stateObj.state_name });
            }
            this.getCityList();
        });
    }

    /**Get list of Cities and bind it to the dropdown list array. Also set the selected value. */
    getCityList() {
        if (this.stateSelectedItems.length > 0) {
            var selectedState = this.stateSelectedItems[0].id;
            this.authService.getAllCities(selectedState).subscribe(city => {
                this.cityDropdownList = [];
                this.citySelectedItems = [];
                if (city.result) {
                    let tempCity = city.result;
                    for (let cityObj of tempCity) {
                        if (cityObj.is_default) {
                            this.citySelectedItems.push({ "id": cityObj.city_id, "itemName": cityObj.city_name });
                        }
                        this.cityDropdownList.push({ "id": cityObj.city_id, "itemName": cityObj.city_name });
                    }
                    this.getAreaList();
                }
                else {
                    this.cityDisable = true;
                    this.citySelectedItems = [];
                    this.getAreaList();
                }

            });
            this.cityDisable = false;
        }
        else {
            this.cityDisable = true;
            this.citySelectedItems = [];
            this.getAreaList();
        }
    }
    /**Get list of Area and bind it to the dropdown list array. Also set the selected value. */
    getAreaList() {
        if (this.citySelectedItems.length > 0) {
            var selectedCity = this.citySelectedItems[0].id;
            this.authService.getAllAreas(selectedCity).subscribe(area => {
                this.areaDropdownList = [];
                let tempArea = area.result;
                if (area.result) {
                    for (let areaObj of tempArea) {
                        if (areaObj.is_default) {
                            this.areaSelectedItems.push({ "id": areaObj.area_id, "itemName": areaObj.area_name });
                        }
                        this.areaDropdownList.push({ "id": areaObj.area_id, "itemName": areaObj.area_name });
                    }
                }
                else {
                    this.areaDisable = true;
                    this.areaSelectedItems = [];
                }
            });
            this.areaDisable = false;
        }
        else {
            this.areaDisable = true;
            this.areaSelectedItems = [];
        }
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
                this.model.existMessage = result.message;
            }
            else {
                this.model.isUserExist = false;
            }
        });
    }

    addUserValues(formObj, f) {       
        if (formObj.valid && this.model.isValidEmail && !this.model.isUserExist && this.model.isValidPassword && this.model.isValidConfirmPassword && this.model.isValidMobile) {
            if (!this.validateNameLength()) {
                this.alert.error(GlobalMessages.registrationNameFieldLenght);
            }
            else if (!this.validateAddressLength()) {
                this.alert.error(GlobalMessages.registrationAddressFieldLenght);
            }
            else {
                if (this.areaSelectedItems.length > 0 && this.citySelectedItems.length > 0 && this.stateSelectedItems.length > 0) {
                    this.userObj.firstName = this.model.firstname;
                    this.userObj.lastName = this.model.lastname;
                    this.userObj.userName = this.model.username;
                    this.userObj.doorKey = this.model.password;
                    this.userObj.mobileNo = this.model.mobile;
                    this.userObj.address1 = this.model.address1;
                    this.userObj.areaid = this.areaSelectedItems[0].id;
                    this.userObj.cityid = this.citySelectedItems[0].id;
                    this.userObj.stateid = this.stateSelectedItems[0].id;

                    this.authService.addUserInfo(this.userObj).subscribe(result => {
                        if (result.status == ConfigurationData.errorStatus) {
                            this.alert.error(result.message);
                        }
                        else {
                            this.alert.success(result.message, true);

                            if (result.token) {
                                this.sharedServe.setCellNo(this.model.mobile);
                                this.router.navigate(['/mobverify']);
                            }
                            else {
                                this.router.navigate(['/login']);
                            }

                        }
                    });
                }
                else {
                    this.alert.error(GlobalMessages.registrationDropdownInvalid);
                }
            }

        }
        else {
            this.alert.error(GlobalMessages.registrationFormInvalid);
        }
    }

    validateNameLength() {
        let fieldLengthValid = true;
        if (this.model.firstname.length > 50 || this.model.lastname.length > 50 || this.model.username > 50) {
            fieldLengthValid = false;
        }
        return fieldLengthValid;
    }

    validateAddressLength() {
        let fieldLengthValid = true;
        if (this.model.address1.length > 100) {
            fieldLengthValid = false;
        }
        return fieldLengthValid;
    }

    validateMobilenumber() {
        var phoneno = /^\d{10}$/;
        this.model.isValidMobile = true;
        if (this.model.mobile.match(phoneno)) {
            this.model.isValidMobile = true;
        }
        else {
            this.model.isValidMobile = false;
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
    CancelClick() {
        this.router.navigate(['/login']);
    }
    onStateItemSelect(item: any) {
        this.getCityList();
        this.getAreaList();
    }
    OnStateItemDeSelect(item: any) {
        this.getCityList();
    }

    onCityItemSelect(item: any) {
        this.getAreaList();
    }
    OnCityItemDeSelect(item: any) {
        //console.log(item);
        //console.log(this.stateSelectedItems);
        this.getAreaList();
    }

    onItemSelect(item: any) {
        console.log(item);
        console.log(this.citySelectedItems);
    }
    OnItemDeSelect(item: any) {
        console.log(item);
        console.log(this.citySelectedItems);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    onDeSelectAll(items: any) {
        console.log(items);
    }
}