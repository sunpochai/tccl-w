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
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { ReviewerService } from '../../_services/config/reviewer.service';
import { ReviewerListComponent } from './reviewer-list/reviewer-list.component';
import { ReviewerDetailComponent } from './reviewer-detail/reviewer-detail.component';
import { ADUserService } from '../../_services/masters/aduser.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": ReviewerListComponent
            }, {
                "path": "detail/:id",
                "component": ReviewerDetailComponent
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
        ReviewerListComponent,
        ReviewerDetailComponent
    ], providers: [
        ReviewerService,
        ADUserService,
        FormBuilder
    ]
})
export class ReviewerModule {

}