import { FormBuilder } from '@angular/forms';
 
import {  
    FormControl ,FormsModule} from '@angular/forms'; 
import { HttpModule } from '@angular/http';
import { AlertComponent } from './../../../../../auth/_directives/alert.component';
 
import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { AlertService } from '../../../../../auth/_services/index';
import { CompanyService } from '../_services/company.service';
 
 
 

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": CompanyListComponent
            },{
                "path": "detail/:id",
                "component": CompanyDetailComponent
            }
        ]
    }
]; 
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),  LayoutModule   ,HttpModule  ,FormsModule  
   
    ], exports: [
        RouterModule
    ], declarations: [
        CompanyListComponent,
        CompanyDetailComponent 
    ],providers:[CompanyService,FormBuilder]
})
export class CompanyModule {



}