import { FormBuilder } from '@angular/forms';
import { FormControl, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertComponent } from './../../../../../auth/_directives/alert.component';
import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { WorklistComponent } from './my/worklist.component';
import { WorklistService } from '../../_services/trns/worklist.service';
import { DocTypeService } from '../../_services/masters/doctype.service';
import { CompanyService } from '../../_services/masters/company.service';
import { PlantService } from '../../_services/masters/plant.service';
import { SortPipe } from '../../../../../_pipe/sort';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "my",
                "component": WorklistComponent
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
        WorklistComponent,
        SortPipe
    ], providers: [
        WorklistService,
        DocTypeService,
        CompanyService,
        PlantService,
        FormBuilder,
        SortPipe
    ]
})
export class WorklistModule {

}