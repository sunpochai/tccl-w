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
import { DelegateService } from '../../_services/config/delegate.service';
import { DelegateListComponent } from './delegate-list/delegate-list.component';
import { DelegateDetailComponent } from './delegate-detail/delegate-detail.component';
import { ADUserService } from '../../_services/masters/aduser.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": DelegateListComponent
            }, {
                "path": "list/:aduser",
                "component": DelegateListComponent
            }, {
                "path": "detail/:id",
                "component": DelegateDetailComponent
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
        DelegateListComponent,
        DelegateDetailComponent
    ], providers: [
        DelegateService,
        ADUserService,
        FormBuilder
    ]
})
export class DelegateModule {

}