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
import { PAListComponent } from './pa-list/pa-list.component';
import { PADetailComponent } from './pa-detail/pa-detail.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { PAService } from '../../_services/trns/pa.service';
import { DocTypeService } from '../../_services/masters/doctype.service';
import { CompanyService } from '../../_services/masters/company.service';
import { PlantService } from '../../_services/masters/plant.service';
import { AttachmentService } from '../../_services/trns/attachment.service';
import { WorkflowService } from '../../_services/trns/workflow.service';
import { ADUserService } from '../../_services/masters/aduser.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": PAListComponent
            }, {
                "path": "detail/:id",
                "component": PADetailComponent
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
        PAListComponent,
        PADetailComponent
    ], providers: [
        PAService,
        DocTypeService,
        CompanyService,
        PlantService,
        AttachmentService,
        WorkflowService,
        ADUserService,
        FormBuilder
    ]
})
export class PAModule {

}