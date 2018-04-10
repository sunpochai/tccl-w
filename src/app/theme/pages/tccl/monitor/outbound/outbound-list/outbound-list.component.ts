import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { OutboundService } from './../../../_services/monitor/outbound.service';
import { C_DOC_STATUS_2, API_OUTBOUND_LIST } from './../../../../../../app-constants';
import { Outbound } from '../../../_models/monitor/outbound';

declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "monitor-outbound-list",
    templateUrl: "./outbound-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OutboundListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public docStatus: Array<any> = C_DOC_STATUS_2;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _outboundService: OutboundService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.docStatus = this.docStatus;
        window.my.namespace = window.my.namespace || {};

        // console.log(window.my.docStatus)
    }

    ngAfterViewInit() {

        this._script.loadScripts('monitor-outbound-list',
            ['assets/tccl/monitor/outbound/outbound-list.js']);

        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_OUTBOUND_LIST);
        });

        super.unblockui('#m-content');
    }

    search() {
        super.blockui('#m-content');
/* 
        var dd_from = $('#m_form_date_from').val().toString().split('/');
        var dd_to = $('#m_form_date_to').val().toString().split('/');

        var date_from = new Date(parseInt(dd_from[2]),parseInt(dd_from[1]),parseInt(dd_from[0]));
        var date_to = new Date(parseInt(dd_to[2]),parseInt(dd_to[1]),parseInt(dd_to[0]));
 
        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid date range!');
            super.unblockui('#m-content');
            return;
        }
 */
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   