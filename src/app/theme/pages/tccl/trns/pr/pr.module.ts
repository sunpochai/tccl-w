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
import { PRListComponent } from './pr-list/pr-list.component';
import { PRDetailComponent } from './pr-detail/pr-detail.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { DocTypeService } from '../../_services/masters/doctype.service';
import { CompanyService } from '../../_services/masters/company.service';
import { PlantService } from '../../_services/masters/plant.service';
import { AttachmentService } from '../../_services/trns/attachment.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": PRListComponent
            }, {
                "path": "detail/:id",
                "component": PRDetailComponent
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
        PRListComponent,
        PRDetailComponent
    ], providers: [DocTypeService, CompanyService, PlantService, AttachmentService, FormBuilder]
})
export class PRModule {

}