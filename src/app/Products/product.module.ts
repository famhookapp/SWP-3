import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {ProductService} from './product.service';
import {ProductList} from './productlist.component';
import {HomeComponent} from '../Home/home.component';
import { Carousel } from '../SharedComponents/Carousel/carousel.component';
import { Slide } from '../SharedComponents/Carousel/slide.component';

@NgModule({
 declarations: [
    HomeComponent,    
    ProductList,    
    Carousel,
    Slide
  ],
  imports: [
      FormsModule,
      CommonModule,
      RouterModule 
  ],
  providers: [ProductService],  
})
export class ProductModule{}
