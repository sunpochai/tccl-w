 
import { DefaultComponent } from './../../../default/default.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TrackingListComponent } from './tracking-list/tracking-list.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { TrackingDetailComponent } from './tracking-detail/tracking-detail.component';
import { FormsModule } from '@angular/forms';
 
 
 

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
        CommonModule, RouterModule.forChild(routes),  LayoutModule ,FormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        TrackingListComponent,
        TrackingDetailComponent
    ]
})
export class TrackingModule {



}