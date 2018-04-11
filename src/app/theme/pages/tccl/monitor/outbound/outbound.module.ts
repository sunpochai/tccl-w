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
import { LayoutModule } from '../../../../layouts/layout.module';
import { AlertService } from '../../../../../auth/_services/index';
import { OutboundService } from '../../_services/monitor/outbound.service';
import { OutboundListComponent } from './outbound-list/outbound-list.component';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": OutboundListComponent
/*             }, {
                "path": "detail/:id",
                "component": PRDetailComponent */
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
        OutboundListComponent
    ], providers: [
        OutboundService,
        FormBuilder
    ]
})
export class OutboundModule {

}