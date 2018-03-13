import { FormBuilder } from '@angular/forms';

import {
    FormsModule
} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertComponent } from './../../../../../auth/_directives/alert.component';

import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RouteApproveListComponent } from './route-list/route-list.component';
import { RouteApproveDetailComponent } from './route-detail/route-detail.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { RouteApproveService } from '../../_services/config/routeapprove.service';
import { DocTypeService } from '../../_services/masters/doctype.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list/:routetype", //routetype:string ('pr','po','pa')
                "component": RouteApproveListComponent
            }, {
                "path": "detail/:id", //id:any ('pr','po','pa' <-- add new record ,id <-- get old record)
                "component": RouteApproveDetailComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, HttpModule, FormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        RouteApproveListComponent,
        RouteApproveDetailComponent
    ], providers: [
        RouteApproveService, 
        DocTypeService,
        FormBuilder
    ]
})
export class RouteApproveModule {

}