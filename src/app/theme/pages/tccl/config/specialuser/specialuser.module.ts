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
import { SpecialUserService } from '../../_services/config/specialuser.service';
import { SpecialUserListComponent } from './specialuser-list/specialuser-list.component';
import { SpecialUserDetailComponent } from './specialuser-detail/specialuser-detail.component';
import { ADUserService } from '../../_services/masters/aduser.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "admin/:usertype", //usertype:string ('admin','maintain')
                "component": SpecialUserListComponent
            }, {
                "path": "maintain/:usertype", //usertype:string ('admin','maintain')
                "component": SpecialUserListComponent
            }, {
                "path": "detail/:id", //id:any ('admin','maintain' <-- add new record ,id <-- get old record)
                "component": SpecialUserDetailComponent
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
        SpecialUserListComponent,
        SpecialUserDetailComponent
    ], providers: [
        SpecialUserService,
        ADUserService,
        FormBuilder
    ]
})
export class SpecialUserModule {

}