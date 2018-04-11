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

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "config-route-list",
    templateUrl: "./route-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RouteApproveListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private routetype: any;
    private api_list: string;
    private scriptpath: string;
    private doctypeList: Array<DocType>;
    private action_route_id: string;
    private action_route_name: string;
    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _routeapproveService: RouteApproveService,
        private _doctypeService: DocTypeService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.prepare_del = this.prepare_del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });
        console.log('ngOnInit');
        console.log(this.route);
        this.route.params.subscribe(params => {
            console.log(params['routetype']);
            //routetype: string ('pr','po','pa')
            switch (params['routetype']) {
                case ROUTE_PR.name:
                    this.routetype = ROUTE_PR;
                    this.api_list = API_ROUTE_PR_LIST;
                    break;
                case ROUTE_PO.name:
                    this.routetype = ROUTE_PO;
                    this.api_list = API_ROUTE_PO_LIST;
                    break;
                case ROUTE_PA.name:
                    this.routetype = ROUTE_PA;
                    this.api_list = API_ROUTE_PA_LIST;
                    break;
            }
            this.scriptpath = 'assets/tccl/config/route/route-' + this.routetype.name + '-list.js';
            // console.log(this.routetype);
            // console.log(this.scriptpath);
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-list', [this.scriptpath]);
        console.log('ngAfterViewInit');
        this.load(this.api_list, this.routetype.doc_group);
    }

    load(api_list, doc_group) {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            // console.log(doc_group);
            myDatatable.init(api_list, doc_group);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/config/route/detail/' + this.routetype.name]);
    }

    prepare_del(routeId, routeName) {
        this.action_route_id = routeId;
        this.action_route_name = routeName;
        console.log(this.action_route_id);
        console.log(this.action_route_name);
    }

    del() {
        super.blockui('#m-content');
        this._routeapproveService.del<any>(this.action_route_id.toString()).subscribe(resp => {
            if (resp.is_error == false) {
                super.showsuccess(this.action_route_name + ' delete complete');
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
                console.log('error');
            },
            () => {
                super.unblockui('#m-content');
                console.log('done');
            });
    }

    navigate_edit(routeId) {
        if (routeId == '') {
            this._router.navigate(['/config/route/detail/' + this.routetype.name]);
        } else {
            this._router.navigate(['/config/route/detail/' + routeId]);
        }
    }

    navigate_list() {
        this._router.navigate(['/config/route/list/' + this.routetype.name + '/' + this.routetype.name]);
    }

    search() {
        console.log('do search');
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   