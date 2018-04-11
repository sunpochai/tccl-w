import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { OutboundService } from './../../../_services/monitor/outbound.service';
import { API_OUTBOUND_LIST, ROUTE_PR, ROUTE_PO, ROUTE_PA, C_OUTBOUND_STATUS, DOCUMENT_GROUP } from './../../../../../../app-constants';

declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "monitor-outbound-list",
    templateUrl: "./outbound-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OutboundListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public outboundStatus: Array<any> = C_OUTBOUND_STATUS;
    public documentGroup: any = DOCUMENT_GROUP;
    public action_name: string;
    public action_display_name: string;
    public action_doc_group: number;
    public action_doc_group_name: string;
    public action_doc_no: string;

    public searchStatus: string = 'E';



    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _outboundService: OutboundService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.prepare_action = this.prepare_action.bind(this);
        // window.my.myROUTE_PR = this.myROUTE_PR;
        // window.my.myROUTE_PO = this.myROUTE_PO;
        // window.my.myROUTE_PA = this.myROUTE_PA;
    }

    ngAfterViewInit() {
        this._script.loadScripts('monitor-outbound-list',
            ['assets/tccl/monitor/outbound/outbound-list.js']);

        this.searchStatus = 'E';

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

        var dd_from = $('#m_form_date_from').val().toString().split('/');
        var dd_to = $('#m_form_date_to').val().toString().split('/');

        var date_from = new Date(parseInt(dd_from[2]),parseInt(dd_from[1]),parseInt(dd_from[0]));
        var date_to = new Date(parseInt(dd_to[2]),parseInt(dd_to[1]),parseInt(dd_to[0]));
 
        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid date range!');
            super.unblockui('#m-content');
            return;
        }

        myDatatable.search();
        super.unblockui('#m-content');
    }

    prepare_action(action: string, doc_group: number, doc_no: string) {
        this.action_name = action;
        this.action_doc_group = doc_group;

        switch (doc_group+'') {
            case ROUTE_PR.doc_group+'': this.action_doc_group_name = ROUTE_PR.name.toUpperCase(); break;
            case ROUTE_PO.doc_group+'': this.action_doc_group_name = ROUTE_PO.name.toUpperCase(); break;
            case ROUTE_PA.doc_group+'': this.action_doc_group_name = ROUTE_PA.name.toUpperCase(); break;
            default: this.action_doc_group_name = 'N/A';
        }

        this.action_doc_no = doc_no;
    }

    performAction() {
        if (this.action_name == 'reupload') {
            this.action_display_name = 'Re-Upload';
            this.reupload();
        } else if (this.action_name == 'manual') {
            this.action_display_name = 'Manual';
            this.manual();
        } else {
            super.showError('Something went wrong! ' + this.action_name + ' is not a valid action');
        }
    }

    reupload() {
        super.blockui('#m-content');

        this._outboundService.reupload<any>(this.action_doc_group, this.action_doc_no).subscribe(
            resp => {
                if (resp.is_error) {
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                } else {
                    super.showsuccess(this.action_doc_group_name + ' ' + this.action_doc_no + this.action_display_name + ' Success');
                    this.search();
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    manual() {
        super.blockui('#m-content');

        this._outboundService.manual<any>(this.action_doc_group, this.action_doc_no).subscribe(
            resp => {
                if (resp.is_error) {
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                } else {
                    super.showsuccess(this.action_doc_group_name + ' ' + this.action_doc_no + this.action_display_name + ' Success');
                    this.search();
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

}   