import { ActivatedRoute, Router } from '@angular/router';

// import {FormControl} from '@angular/forms';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_ROUTE_LIST, ROUTE_PR, ROUTE_PO, ROUTE_PA } from './../../../../../../app-constants';
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
    private scriptpath: string;
    private doctypeList: Array<DocType>;
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
                    break;
                case ROUTE_PO.name:
                    this.routetype = ROUTE_PO;
                    break;
                case ROUTE_PA.name:
                    this.routetype = ROUTE_PA;
                    break;
            }
            this.scriptpath = 'assets/tccl/config/route/route-' + this.routetype.name + '-list.js';
            console.log(this.routetype);
        });
    }
    
    ngAfterViewInit() {
        this._script.loadScripts('config-route-list',[this.scriptpath]);

        this.load(this.routetype.doc_group);
    }

    load(doc_group) {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            console.log(doc_group);
            myDatatable.init(API_ROUTE_LIST, doc_group);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/config/route/detail/0']);
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
        this._router.navigate(['/config/route/detail/' + routeId]);
    }

    search() {
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }
    
}   