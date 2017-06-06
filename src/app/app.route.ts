import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './Home/home.component';
import {LoginComponent} from './Login/login.component';
import{RegisterComponent} from './Registration/register.component';
import{MobileVerificationComponent} from './Registration/mobverification.component';
import {ProductList} from './Products/productlist.component';
import {AuthGuard} from './Guards/auth.guards';
import {HeaderComponent} from './SharedComponents/header.component';

const appRoutes : Routes = [{path:'login', component:LoginComponent, pathMatch: 'full'},
    {path:'register', component:RegisterComponent, pathMatch: 'full'},
    {path:'mobverify', component:MobileVerificationComponent, pathMatch: 'full'},
    {path:'fullhouse', component:HeaderComponent, canActivate:[AuthGuard], children:[
        {path:'home', component:HomeComponent, outlet:'headeroutlet'},
        {path:'products', component:ProductList, outlet:'headeroutlet'}
    ]},    
    {path:'**', redirectTo:'fullhouse/home'}];



export const routing = RouterModule.forRoot(appRoutes);

