import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ProductsModel} from './product.model';

import {ConfigurationData} from '../CommonServices/configuration.model';
import {SharedServiceGM} from '../CommonServices/shared.service';

@Injectable()
export class ProductService{

    constructor(private http:Http,
    private sharedServe:SharedServiceGM){}

    getHomeOffer(){
        var tokenKey = this.sharedServe.getTokenKey();

        let rawData = {token:tokenKey};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'product/homepageoffer', rawData, options)
        .map((response : Response) => {
            console.log('Product list ', response.json());
            return response.json()
        });
    }

    getHomeCategory(){
        var tokenKey = this.sharedServe.getTokenKey();

        let rawData = {token:tokenKey};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'product/homepagecategory', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    }

    getHomeBanner(){
        var tokenKey = this.sharedServe.getTokenKey();

        let rawData = {token:tokenKey};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'product/homepagebanner', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    }    

    getAllProductList(sortOrder, brandId, categoryId, searchKeyword){
        var tokenKey = this.sharedServe.getTokenKey();        

        let rawData = {orderby : sortOrder, brandid:brandId, categoryid:categoryId, searchkey:searchKeyword, token:tokenKey};  
        //let bodyString = JSON.stringify(authInfo); //Stringify object
        let headers = new Headers({ 'Content-Type': 'application/json' }); //Set content type to JSON
        let options = new RequestOptions({ headers: headers, withCredentials: true});

        return this.http.post(ConfigurationData.appBLURL + 'product/prodlist', rawData, options)
        .map((response : Response) => {            
            return response.json()
        });
    }    
}