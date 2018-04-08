import { ClickOutsideDirective } from './../../../../../_directives/dropdown.directive';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

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
import { TrackingService } from '../../_services/masters/tracking.service';
import { SearchFilterPipe } from '../../../../../_pipe/filter-pipe';
import { LetterBoldPipe } from '../../../../../_pipe/letter-bold.pipe';
import { UserService } from '../../../../../auth/_services/user.service';
import { ADUserService } from '../../_services/masters/aduser.service';
import { PipesModule } from '../../../../../_pipe/pipes.module';
 

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list/pr/:routetype", //routetype:string ('pr','po','pa')
                "component": RouteApproveListComponent
            }, {
                "path": "list/po/:routetype", //routetype:string ('pr','po','pa')
                "component": RouteApproveListComponent
            }, {
                "path": "list/pa/:routetype", //routetype:string ('pr','po','pa')
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
        CommonModule, RouterModule.forChild(routes), LayoutModule, HttpModule,ReactiveFormsModule, FormsModule,
        PipesModule
    ], exports: [
        RouterModule
    ], declarations: [  
        RouteApproveListComponent,
        RouteApproveDetailComponent,ClickOutsideDirective,SearchFilterPipe,LetterBoldPipe
    ], providers: [
        RouteApproveService,  
        DocTypeService,  
        TrackingService,
        ADUserService,
        FormBuilder
    ]
})
export class RouteApproveModule {

}