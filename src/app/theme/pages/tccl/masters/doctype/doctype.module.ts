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
import { DocTypeListComponent } from './doctype-list/doctype-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DocTypeDetailComponent } from './doctype-detail/doctype-detail.component';
import { AlertService } from '../../../../../auth/_services/index';
import { DocTypeService } from '../_services/doctype.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": DocTypeListComponent
            }, {
                "path": "detail/:id",
                "component": DocTypeDetailComponent
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
        DocTypeListComponent,
        DocTypeDetailComponent
    ], providers: [DocTypeService, FormBuilder]
})
export class DocTypeModule {

}