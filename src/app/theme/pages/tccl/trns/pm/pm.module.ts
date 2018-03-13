import { PMDetailComponent } from './pm-detail/pm-detail.component';
import { FormBuilder } from '@angular/forms';

import {
    FormControl, FormsModule
} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertComponent } from './../../../../../auth/_directives/alert.component';

import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PMListComponent } from './pm-list/pm-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { PMService } from '../../_services/trns/pm.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": PMListComponent
            }/* , {
                "path": "detail/:id",
                "component": DocTypeDetailComponent
            } */
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, HttpModule, FormsModule


    ], exports: [
        RouterModule
    ], declarations: [
        PMListComponent,
        PMDetailComponent/* ,
        
        DocTypeDetailComponent */
    ], providers: [PMService, FormBuilder]
})
export class PMModule {

}