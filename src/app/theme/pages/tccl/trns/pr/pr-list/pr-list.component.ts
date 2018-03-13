import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { PRService } from './../../../_services/trns/pr.service';
import { API_PR_LIST, C_DOC_STATUS } from './../../../../../../app-constants';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { CompanyService } from '../../../_services/masters/company.service';
import { DocType } from '../../../_models/masters/doctype';
import { PlantService } from '../../../_services/masters/plant.service';
import { Company } from '../../../_models/masters/company';
import { Plant } from '../../../_models/masters/plant';

declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "trns-pr-list",
    templateUrl: "./pr-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PRListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public doctypeList: Array<DocType>;
    public companyList: Array<Company>;
    public plantList: Array<Plant>;
    public cDocStatus: Array<Array<any>> = C_DOC_STATUS;
      
    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _doctypeService: DocTypeService,
        private _companyService: CompanyService,
        private _plantService: PlantService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.C_DOC_STATUS = C_DOC_STATUS;
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        // console.log(window.my.C_DOC_STATUS);

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        this._companyService.getall().subscribe(data => {
            this.companyList = data;
            // console.log(data);
        });

        this._plantService.getall().subscribe(data => {
            this.plantList = data;
            // console.log(data);
        });

    }

    ngAfterViewInit() {

        this._script.loadScripts('trns-pr-list',
            ['assets/tccl/trns/pr/pr-list.js']);

        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_PR_LIST);
        });
        
        super.unblockui('#m-content');
    }

    navigate_edit(prId) {
        this._router.navigate(['/trns/pr/detail/' + prId]);
    }

    search() {
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   