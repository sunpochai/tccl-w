import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_ROUTE_PR_LIST, API_ROUTE_PO_LIST, API_ROUTE_PA_LIST, ROUTE_PR, ROUTE_PO, ROUTE_PA, ROUTE_NPO, API_ROUTE_NPO_LIST } from './../../../../../../app-constants';
import { RouteApproveService } from '../../../_services/config/routeapprove.service';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { Tracking } from '../../../_models/masters/tracking';
import { RouteCriteria } from '../../../_models/config/routecriteria';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "config-route-list",
    templateUrl: "./route-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RouteApproveListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public routetype: any;
    public api_list: string;
    public scriptpath: string;
    public doctypeList: Array<DocType>;
    public trackingNumberList: Array<Tracking>;
    public action_route_id: string;
    public action_route_name: string;
    public routeSearchCriteria: RouteCriteria = new RouteCriteria;
    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _routeapproveService: RouteApproveService,
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
        
        this.route.params.subscribe(params => {
            // console.log(params['routetype']);
            //routetype: string ('pr','po','pa','npo')
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
                case ROUTE_NPO.name:
                    this.routetype = ROUTE_NPO;
                    this.api_list = API_ROUTE_NPO_LIST;
                    break;
            }
            this.scriptpath = 'assets/tccl/config/route/route-' + this.routetype.name + '-list.js';

            /** 
             * manage search criteria when BACK from detail page
             * weeraya 16/10/2018
             */
            let tmp_m = params['m'];
            if (tmp_m != null && tmp_m == 'back') {
                /**
                 * go back from detail page
                 * 1.read from local storage
                 * 2.if exists then remove key
                 */
                let tmp_criteria = JSON.parse(localStorage.getItem('routeSearchCriteria'));
                console.log(tmp_criteria);

                if (tmp_criteria != null && tmp_criteria != '') {
                    console.log('-');
                    this.routeSearchCriteria = tmp_criteria;
                    localStorage.removeItem('routeSearchCriteria');
                }
            } else {
                /**
                 * init
                 * 1.if local storage exists then remove key
                 */
                let tmp_criteria = JSON.parse(localStorage.getItem('routeSearchCriteria'));
                console.log(tmp_criteria);

                if (tmp_criteria != null && tmp_criteria != '') {
                    console.log('*');
                    localStorage.removeItem('routeSearchCriteria');
                }
            }
        });

        this._doctypeService.getall().subscribe(resp => {
            this.doctypeList = resp;
            // console.log(resp);
        });
        
        if (this.routetype == ROUTE_NPO) {
            this._trackingService.getnpoall().subscribe(resp => {
                this.trackingNumberList = resp;
                // console.log(resp);
            });
        } else {
            this._trackingService.getall().subscribe(resp => {
                this.trackingNumberList = resp;
                // console.log(resp);
            });
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-list', [this.scriptpath]);
        // console.log('ngAfterViewInit');
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
        // console.log(this.action_route_id);
        // console.log(this.action_route_name);
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
                // console.log('error');
            },
            () => {
                super.unblockui('#m-content');
                // console.log('done');
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
        // console.log('do search');
        super.blockui('#m-content');
        // this.routeSearchCriteria.ms_doctype = '';
        // this.routeSearchCriteria.route_name = $('#m_form_route_name').val();
        // this.routeSearchCriteria.tracking_no
        // this.routeSearchCriteria.doc_type
        localStorage.setItem('routeSearchCriteria',JSON.stringify({
            'doc_type' : this.routeSearchCriteria.doc_type,
            'ms_doctype' : this.routeSearchCriteria.ms_doctype,
            'route_name' : this.routeSearchCriteria.route_name,
            'tracking_no' : this.routeSearchCriteria.tracking_no
        }));
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   