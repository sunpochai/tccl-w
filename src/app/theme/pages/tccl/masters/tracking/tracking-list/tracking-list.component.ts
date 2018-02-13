import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

import { TrackingService } from '../../_services/tracking.service';
import { API_TRACKING_LIST } from './../../../../../../app-constants';




declare var DataTableTracking: any;

@Component({
    selector: "master-tracking-list",
    templateUrl: "./tracking-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TrackingListComponent implements OnInit, AfterViewInit {


    constructor(private _script: ScriptLoaderService, private trackingService: TrackingService) {

    }
    ngOnInit() {


    }
    ngAfterViewInit() {

        this._script.loadScripts('master-tracking-list',
            ['assets/tccl/masters/tracking/tracking-list.js']);



        // $('#m_datatable').load('https://keenthemes.com/metronic/preview/inc/api/datatables/demos/default.php')
        jQuery(document).ready(function() {
            DataTableTracking.init(API_TRACKING_LIST);
        });

        //  mApp.block('#m_form_1', {});

        // this.trackingService.loaddata().subscribe(data  => {
        //            console.log(data);
        //       
        // });

    }

}   