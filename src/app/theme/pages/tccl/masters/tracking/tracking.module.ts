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
import { TrackingListComponent } from './tracking-list/tracking-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { TrackingDetailComponent } from './tracking-detail/tracking-detail.component';
import { AlertService } from '../../../../../auth/_services/index';
import { TrackingService } from '../../_services/masters/tracking.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": TrackingListComponent
            }, {
                "path": "detail/:id",
                "component": TrackingDetailComponent
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
        TrackingListComponent,
        TrackingDetailComponent
    ], providers: [TrackingService, FormBuilder]
})
export class TrackingModule {

}