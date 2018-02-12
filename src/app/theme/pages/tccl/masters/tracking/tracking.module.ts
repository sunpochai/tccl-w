import { AlertComponent } from './../../../../../auth/_directives/alert.component';
 
import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TrackingListComponent } from './tracking-list/tracking-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { TrackingDetailComponent } from './tracking-detail/tracking-detail.component';
import { TrackingService } from '../_services/tracking.service';
import { AlertService } from '../../../../../auth/_services/index';
 
 
 

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "list",
                "component": TrackingListComponent
            },{
                "path": "detail",
                "component": TrackingDetailComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),  LayoutModule   
    ], exports: [
        RouterModule
    ], declarations: [
        TrackingListComponent,
        TrackingDetailComponent 
    ],providers:[TrackingService,AlertService]
})
export class TrackingModule {



}