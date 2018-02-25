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
import { PaymentListComponent } from './payment-list/payment-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
//import { DocTypeDetailComponent } from './doctype-detail/doctype-detail.component';
import { AlertService } from '../../../../../auth/_services/index';
import { PaymentService } from '../_services/payment.service';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": PaymentListComponent
            }/* , {
                "path": "detail/:id",
                "component": DocTypeDetailComponent
            } */
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, HttpModule, FormsModule

    ], exports: [
        RouterModule
    ], declarations: [
        PaymentListComponent/* ,
        DocTypeDetailComponent */
    ], providers: [PaymentService, FormBuilder]
})
export class PaymentModule {

}