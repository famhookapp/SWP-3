import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import {ConfigurationData} from '../CommonServices/configuration.model';
import {SharedServiceGM} from '../CommonServices/shared.service';
import {ProductService} from '../Products/product.service';
import {ProductSearchModel} from '../Products/productsearch.model';

@Component({  
  templateUrl: './header.component.html',  
  providers:[ProductService]
})
/**This is the parent page for all the internal pages. */
export class HeaderComponent implements OnInit {

  prodSearchCtrl: FormControl;
  filteredProducts: any;
  productsList:any;
  prodSearchKey:string;  
  productSearchModel:ProductSearchModel;
    
  constructor(private router : Router, private actRoute: ActivatedRoute, 
  private cookieServe: CookieService, private prodServe: ProductService,
  private sharedServe:SharedServiceGM){
     console.log("userinfor", cookieServe.get(ConfigurationData.currentUserDetails));
     this.router.navigate(['/fullhouse', {outlets:{'headeroutlet':['home']}}]);
     //Initialize the form cntrl
    this.prodSearchCtrl = new FormControl();    
}

ngOnInit(){
  var homeSortOrder = ConfigurationData.homeProductsSortOrder;
  this.productsList = [];
  //Get the product list and send the default order by.
  this.prodServe.getAllProductList(homeSortOrder, '', '', '').subscribe(products => {
    if(products && products.result)
    {
      for(var prod of products.result)
      {
        this.productsList.push(prod.product_name);
      }
    }    
  });

    this.filteredProducts = this.prodSearchCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterProductList(name));
}

//Filter the list of products as user is typing in textbox.
filterProductList(val: string) {
    return val ? this.productsList.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.productsList;
  }

//Logout the user and clear cookies.
logout():void{
  this.cookieServe.removeAll();
  this.router.navigate(['/login']);
}

searcProductList(){
  console.log("search keyword", this.prodSearchCtrl.value);
  this.sharedServe.setProductSearch(this.prodSearchCtrl.value, '',0,0);
  this.router.navigate(['/fullhouse', {outlets:{'headeroutlet':['products']}}]);
}

}
