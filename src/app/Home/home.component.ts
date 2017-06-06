import { Component, OnInit } from '@angular/core';
import {Router, RouterModule} from '@angular/router';

import {ProductService} from '../Products/product.service';
import {ProductsModel} from '../Products/product.model';

@Component({
    moduleId:module.id,
    templateUrl:'home.component.html'
})
export class HomeComponent implements OnInit{

    productsOffer:any;
    productsCategory:any;
    productsBannerTop:any;
    productsBannerBottom:any;
    //The time to show the next photo
    private NextPhotoInterval:number = 3000;
    //Looping or not
    private noLoopSlides:boolean = false;
    //Photos Category
    private slides:Array<any> = [];
    constructor(private productServe:ProductService, private router:Router){
        
    }

    ngOnInit(){
        this.loadHomeProducts();               
    }

    private addNewSlide() {

        if(this.productsBannerTop)
        {
            for(var loopCnt=0;loopCnt<this.productsBannerTop.length;loopCnt++)
            {
                this.slides.push({image:this.productsBannerTop[loopCnt].ad_image_path, text:this.productsBannerTop[loopCnt].ad_title});
            }
        }

        //  this.slides.push(
        //     {image:'assets/images/banner.png',text:'BMW 1'},
        //     {image:'assets/images/banner-bg.jpg',text:'BMW 2'},
        //     {image:'assets/images/banner-bg.jpg',text:'BMW 3'},
        //     {image:'assets/images/banner-bg.jpg',text:'BMW 4'},
        //     {image:'assets/images/banner-bg.jpg',text:'BMW 5'},
        //     {image:'assets/images/banner-bg.jpg',text:'BMW 6'}
        // );
    }

    private loadHomeProducts()
    {
       this.productServe.getHomeOffer().subscribe(products => {
           this.productsOffer = products.result;
            if(!this.productsOffer)
            {
                    this.productsOffer = [{"image_path":"assets/images/offer1.png","home_search_keyword":"milk"},{"image_path":"assets/images/offer2.png","home_search_keyword":"milk"},{"image_path":"assets/images/offer3.png","home_search_keyword":"milk"}];
            }       
        });

        this.productServe.getHomeCategory().subscribe(productsCategory => {           

           for(var cnt=0;cnt<productsCategory.result.length;cnt++)
           {
               productsCategory.result[cnt].styleClass = (cnt == 0) ? "item active" : "item";
           } 
           console.log('productsCategory.result', productsCategory.result);

           this.productsCategory = productsCategory.result;               

        });

        this.productServe.getHomeBanner().subscribe(productsBanner => {
           this.productsBannerTop = [];
           this.productsBannerBottom = [];
           for(var cnt=0;cnt<productsBanner.result.length;cnt++)
           {
               if(productsBanner.result[cnt].display_section == 1 || productsBanner.result[cnt].display_section == "1")
               {
                    this.productsBannerTop.push(productsBanner.result[cnt]);
               }
               else
               {
                   this.productsBannerBottom.push(productsBanner.result[cnt]);
               }               
           }                 
           this.addNewSlide(); 
        });
    }
}