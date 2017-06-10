import {Injectable} from '@angular/core';
import {CookieService, CookieOptionsArgs} from 'angular2-cookie/core';

import {ConfigurationData} from '../CommonServices/configuration.model';
import {ProductSearchModel} from '../Products/productsearch.model';

@Injectable()
export class SharedServiceGM{
    isLoginPage : boolean = false;
    productSearchModel:ProductSearchModel;
    public cellnumber:string;

    constructor(private cookieServe:CookieService){
        this.productSearchModel = new ProductSearchModel();
    }

    /**This will provide the user token key. Move this to common utility service. */
    public getTokenKey()
    {
        let currentUser = this.cookieServe.get(ConfigurationData.currentUserName);
        return currentUser;
    }

    public getUserBasicInfo()
    {
        let currentUserDetails = this.cookieServe.get(ConfigurationData.currentUserDetails);                
        return currentUserDetails;
    }

    public setProductSearch(searchKeyword:string, orderBy:string, brandId:number, categoryId:number)
    {
        this.productSearchModel.searchkeyword = searchKeyword;
        this.productSearchModel.orderby = orderBy;
        this.productSearchModel.brandid = brandId;
        this.productSearchModel.categoryid = categoryId;
    }
    
    public getProductSearch()
    {
        return this.productSearchModel;
    }

    public setCellNo(mob)
    {
        this.cellnumber = mob;
    }

    public getCellNo()
    {
        return this.cellnumber;
    }
}