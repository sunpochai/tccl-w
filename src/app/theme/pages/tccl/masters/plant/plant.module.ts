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
import { PlantListComponent } from './plant-list/plant-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { PlantDetailComponent } from './plant-detail/plant-detail.component';
import { AlertService } from '../../../../../auth/_services/index';
import { PlantService } from '../../_services/masters/plant.service';
import { CompanyService } from '../../_services/masters/company.service';


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": PlantListComponent
            }, {
                "path": "detail/:id",
                "component": PlantDetailComponent
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
        PlantListComponent,
        PlantDetailComponent
    ], providers: [PlantService, CompanyService, FormBuilder]
})

export class PlantModule {

}