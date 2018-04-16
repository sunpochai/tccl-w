import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { PRService } from './../../../_services/trns/pr.service';
import { API_PR_LIST, C_DOC_STATUS_2, C_DOC_STATUS_WAIT_REVIEW, C_DOC_STATUS_REVIEWED, C_DOC_STATUS_APPROVED, C_DOC_STATUS_REJECTED, C_DOC_STATUS_CANCELLED } from './../../../../../../app-constants';
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
    selector: "trns-pr-list",
    templateUrl: "./pr-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class PRListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public doctypeList: Array<DocType>;
    public docStatus: Array<any> = C_DOC_STATUS_2;
    
    public dateFrom: any;
    public dateTo: any;
    public m_form_pr_no;
    public m_form_doc_type;
    public m_form_company;
    public m_form_plant;
    public chkStatusAll = false;
    public chkStatusWaitReview = true;
    public chkStatusWaitApprove = true;
    public chkStatusApproved = false;
    public chkStatusRejected = false;
    public chkStatusCancelled = false;

    public showSearchForm: boolean = false;

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

        // this.dateFrom = DateUtil.toDisplayDate( DateUtil.getCurrentMonthFirstDate() );
        // this.dateTo = DateUtil.toDisplayDate( DateUtil.getCurrentMonthLastDate() );

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
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
        
        // var date_from = new Date(parseInt(dd_from[2]),parseInt(dd_from[1]),parseInt(dd_from[0]));
        // var date_to = new Date(parseInt(dd_to[2]),parseInt(dd_to[1]),parseInt(dd_to[0]));

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
        this.m_form_pr_no = '';
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
        this.chkStatusCancelled = false;
    }

    toggleStatusAll() {
        this.chkStatusWaitReview = this.chkStatusAll;
        this.chkStatusWaitApprove = this.chkStatusAll;
        this.chkStatusApproved = this.chkStatusAll;
        this.chkStatusCancelled = this.chkStatusAll;
        this.chkStatusRejected = this.chkStatusAll;
    }

    toggleSearchForm() {
        console.log(this.showSearchForm);
        this.showSearchForm = !this.showSearchForm;
    }

    getSearchFormLinkCaption(): string {
        console.log(this.showSearchForm);
        return (this.showSearchForm) ? 'Hide search' : 'Show search' ;
    }

}   