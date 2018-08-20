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
import { NPOListComponent } from './npo-list/npo-list.component';
import { NPODetailComponent } from './npo-detail/npo-detail.component';
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
import { NPOService } from '../../_services/trns/npo.service';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": NPOListComponent
            }, {
                "path": "detail/:id", //id:any ('npo' <-- add new record ,id <-- get old record)
                "component": NPODetailComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, HttpModule, ReactiveFormsModule, FormsModule,
        PipesModule
    ], exports: [
        RouterModule
    ], declarations: [
        NPOListComponent,
        NPODetailComponent, ClickOutsideDirective, SearchFilterPipe, LetterBoldPipe
    ], providers: [
        RouteApproveService,
        NPOService,
        DocTypeService,
        TrackingService,
        ADUserService,
        FormBuilder
    ]
})
export class NPOModule {

}