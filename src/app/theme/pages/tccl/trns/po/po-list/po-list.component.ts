import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { POService } from './../../../_services/trns/po.service';
import { API_PO_LIST, C_DOC_STATUS_2 } from './../../../../../../app-constants';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { CompanyService } from '../../../_services/masters/company.service';
import { DocType } from '../../../_models/masters/doctype';
import { PlantService } from '../../../_services/masters/plant.service';
import { Company } from '../../../_models/masters/company';
import { Plant } from '../../../_models/masters/plant';
import { DateUtil } from '../../../../../../Util/dateutil';

declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "trns-po-list",
    templateUrl: "./po-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class POListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public doctypeList: Array<DocType>;
    public docStatus: Array<any> = C_DOC_STATUS_2;

    public dateFrom: any;
    public dateTo: any;
    public m_form_po_no;
    public m_form_doc_type;
    public m_form_company;
    public m_form_plant;
    public chkStatusAll = false;
    public chkStatusWaitReview = true;
    public chkStatusWaitApprove = true;
    public chkStatusApproved = false;
    public chkStatusRejected = false;
    public chkStatusCanceled = false;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _doctypeService: DocTypeService,
        private _companyService: CompanyService,
        private _plantService: PlantService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.docStatus = this.docStatus;
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        // console.log(window.my.docStatus);

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        // this._companyService.getall().subscribe(data => {
        //     this.companyList = data;
        //     // console.log(data);
        // });

        // this._plantService.getall().subscribe(data => {
        //     this.plantList = data;
        //     // console.log(data);
        // });

        // console.log('ngOnInit');
    }

    ngAfterViewInit() {
        // console.log('ngAfterViewInit:1');

        this._script.loadScripts('trns-po-list',
            ['assets/tccl/trns/po/po-list.js']);

        // console.log('ngAfterViewInit:2');

        this.load();
        // console.log('ngAfterViewInit:3');

    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_PO_LIST);
        });

        super.unblockui('#m-content');
    }

    navigate_edit(poId) {
        this._router.navigate(['/trns/po/detail/' + poId]);
    }


    search() {
        super.blockui('#m-content');

        if (this.dateFrom != null && this.dateFrom != '' && this.dateTo != null && this.dateTo != '') {
            console.log(this.dateFrom);
            console.log(this.dateTo);

            var date_from = DateUtil.toInternalDate(this.dateFrom);
            var date_to = DateUtil.toInternalDate(this.dateTo);

            console.log(date_from.getTime());
            console.log(date_to.getTime());

            if (date_from.getTime() > date_to.getTime()) {
                super.showError('Invalid date range!');
                super.unblockui('#m-content');
                return;
            }
        }

        myDatatable.search();
        super.unblockui('#m-content');
    }

    clearForm() {
        this.m_form_po_no = '';
        this.m_form_doc_type = '';
        this.m_form_company = '';
        this.m_form_plant = '';
        this.dateFrom = '';
        this.dateTo = '';

        this.chkStatusAll = false;
        this.chkStatusWaitReview = true;
        this.chkStatusWaitApprove = true;
        this.chkStatusApproved = false;
        this.chkStatusRejected = false;
        this.chkStatusCanceled = false;
    }

    toggleStatusAll() {
        // console.log(this.chkStatusAll);

        this.chkStatusWaitReview = this.chkStatusAll;
        this.chkStatusWaitApprove = this.chkStatusAll;
        this.chkStatusApproved = this.chkStatusAll;
        this.chkStatusCanceled = this.chkStatusAll;
        this.chkStatusRejected = this.chkStatusAll;
    }
}   