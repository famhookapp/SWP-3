import { Component, OnInit } from '@angular/core';

import {ProductService} from '../Products/product.service';
import {ProductsModel} from '../Products/product.model';
import {SharedServiceGM} from '../CommonServices/shared.service';
import {ProductSearchModel} from '../Products/productsearch.model';

@Component({
    moduleId:module.id,
    templateUrl:'productlist.component.html'
})
export class ProductList implements OnInit{
    productSearchModel:ProductSearchModel;
    products: any = [];
    constructor(private productServe:ProductService,    
    private sharedServe:SharedServiceGM){}

    ngOnInit(){
        this.loadHomeProducts();        

        this.productSearchModel = this.sharedServe.getProductSearch();
        console.log('ProductSearchModel', this.productSearchModel.searchkeyword);
    }

     private loadHomeProducts()
    {
       this.productServe.getHomeBanner().subscribe(products => this.products = products);
    }
}