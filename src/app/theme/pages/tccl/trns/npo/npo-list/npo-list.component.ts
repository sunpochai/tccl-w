import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_ROUTE_PR_LIST, API_ROUTE_PO_LIST, API_ROUTE_PA_LIST, ROUTE_PR, ROUTE_PO, ROUTE_PA } from './../../../../../../app-constants';
import { RouteApproveService } from '../../../_services/config/routeapprove.service';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { Tracking } from '../../../_models/masters/tracking';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "trns-npo-list",
    templateUrl: "./npo-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class NPOListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public doctypeList: Array<DocType>;
    public trackingNumberList: Array<Tracking>;
    public action_npo_id: string;
    public action_npo_number: string;
    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _npoService: RouteApproveService,
        private _doctypeService: DocTypeService,
        private _trackingService: TrackingService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.prepare_del = this.prepare_del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        this._doctypeService.getall().subscribe(resp => {
            this.doctypeList = resp;
            // console.log(resp);
        });


        this._trackingService.getall().subscribe(resp => {
            this.trackingNumberList = resp;
            // console.log(resp);
        });
        
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-list', ['assets/tccl/trns/npo/npo-list.js']);
        // console.log('ngAfterViewInit');
        this.load(API_ROUTE_PR_LIST);
    }

    load(api_list) {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            // console.log(doc_group);
            myDatatable.init(api_list);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/trns/npo/detail/0']);
    }

    prepare_del(routeId, routeName) {
        this.action_npo_id = routeId;
        this.action_npo_number = routeName;
        // console.log(this.action_route_id);
        // console.log(this.action_route_name);
    }

    del() {
        super.blockui('#m-content');
        this._npoService.del<any>(this.action_npo_id.toString()).subscribe(resp => {
            if (resp.is_error == false) {
                super.showsuccess(this.action_npo_number + ' delete complete');
                myDatatable.reload();
                super.unblockui('#m-content');
            } else {
                super.showError(resp.error_msg);
                super.unblockui('#m-content');
            }
        },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
                // console.log('error');
            },
            () => {
                super.unblockui('#m-content');
                // console.log('done');
            });
    }

    navigate_edit(npoId) {
        if (npoId == '') {
            this._router.navigate(['/trns/npo/detail/0']);
        } else {
            this._router.navigate(['/trns/npo/detail/' + npoId]);
        }
    }

    navigate_list() {
        this._router.navigate(['/trns/npo/list/']);
    }

    search() {
        // console.log('do search');
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   