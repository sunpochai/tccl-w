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
import { UserLockService } from '../../_services/system/userlock.service';
import { UserLockListComponent } from './userlock-list/userlock-list.component';
import { UserLockDetailComponent } from './userlock-detail/userlock-detail.component';
import { ADUserService } from '../../_services/masters/aduser.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [{
            "path": "list",
            "component": UserLockListComponent
        }, {
            "path": "detail/:id",
            "component": UserLockDetailComponent
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
        UserLockListComponent,
        UserLockDetailComponent
    ], providers: [
        UserLockService,
        ADUserService,
        FormBuilder
    ]
})
export class UserLockModule {

}