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
import { POListComponent } from './po-list/po-list.component';
import { PODetailComponent } from './po-detail/po-detail.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { POService } from '../../_services/trns/po.service';
import { DocTypeService } from '../../_services/masters/doctype.service';
import { CompanyService } from '../../_services/masters/company.service';
import { PlantService } from '../../_services/masters/plant.service';
import { AttachmentService } from '../../_services/trns/attachment.service';
import { WorkflowService } from '../../_services/trns/workflow.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": POListComponent
            }, {
                "path": "detail/:id",
                "component": PODetailComponent
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
        POListComponent,
        PODetailComponent
    ], providers: [
        POService, 
        DocTypeService, 
        CompanyService, 
        PlantService, 
        AttachmentService, 
        WorkflowService, 
        FormBuilder
    ]
})
export class POModule {

}