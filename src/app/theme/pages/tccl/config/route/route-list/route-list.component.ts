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
    public routetype: any;
    public api_list: string;
    public scriptpath: string;
    public doctypeList: Array<DocType>;
    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _routeapproveService: RouteApproveService,
        private _doctypeService: DocTypeService) {
        super();
    }

    // myControl: FormControl = new FormControl();

    // options = [
    //     'One',
    //     'Two',
    //     'Three'
    // ];

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

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
            console.log(this.routetype);
        });
    }
    
    ngAfterViewInit() {
        this._script.loadScripts('config-route-list',[this.scriptpath]);

        this.load(this.api_list,this.routetype.doc_group);
    }

    load(api_list,doc_group) {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            console.log(doc_group);
            myDatatable.init(api_list, doc_group);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/config/route/detail/'+this.routetype.name]);
    }

    del() {
        // super.blockui('#m-content');
        // let compCode = $('#comCodeDeleteSelected').val();
        // this._companyService.del(compCode.toString()).subscribe(resp => {

        //     super.showsuccess(compCode + ' delete complete');
        //     myDatatable_company.reload();
        // },
        //     error => {
        //         super.showError(error);
        //         super.unblockui('#m-content');
        //         console.log('error');
        //     },
        //     () => {
        //         super.unblockui('#m-content');
        //         console.log('done');
        //     });
    }

    navigate_edit(routeId) {
        if (routeId == '') {
            this._router.navigate(['/config/route/detail/' + this.routetype.name]);
        } else {
            this._router.navigate(['/config/route/detail/' + routeId]);
        }
    }

    navigate_list() {
        this._router.navigate(['/config/route/list/' + this.routetype.name]);
    }

    search() {
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }
    
}   