import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { PMService } from './../../../_services/trns/pm.service';
import { API_DOCTYPE_LIST, API_PAYMENT_LIST } from './../../../../../../app-constants';



declare var myDatatable: any;
declare var window: any

@Component({
    selector: "trn-pm-list",
    templateUrl: "./pm-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PMListComponent extends PageBaseComponent implements OnInit, AfterViewInit {


    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _pmService: PMService) {
        super();
    }
    ngOnInit() {

        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        // window.my.namespace.del = this.del.bind(this);
        // window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
    }
    ngAfterViewInit() {

        this._script.loadScripts('trn-pm-list',
            ['assets/tccl/trn/pm/pm-list.js']);

        this.load();

    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            // var dataJSONArray = JSON.parse('[{"RecordID":1,"po_no":"PO100000528","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB88,500","company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าหมึกพิมพ์ HP สำหรับเครื่องพิมพ์แผนกการเงิน"},{"RecordID":2,"po_no":"PO100000553","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":2,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB6,800" ,"company":"8017 - บจก.สินทรัพย์","Vendor":"1001022 สินทรัพย์1","Subject":"ค่าอุปกรณ์เครื่องเขียนสำนักงาน"},{"RecordID":3,"po_no":"PO100000566","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":3,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB3,200" ,"company":"8139 - บจก.แอสเสท เวิรด์","Vendor":"1001159 บจก.โฟนิกซ์","Subject":"ค่าซ่อมเครื่องถ่ายเอกสาร"},{"RecordID":4,"po_no":"PO100001416","po_date":"01/12/2017","doc_type":"NB","plant":"2160-สำนักงานใหญ่","po_status":1,"purchasing":"สุรพล","start_date":"02/12/2017 08.00","due_date":"31/01/2018 08.00","total_price":"THB126,500","company":"8211 - บจก.จัดการสินทรัพย์","Vendor":"1000881 บจก.ฟีนิกซ์","Subject":"ค่ากระดาษบันทึกรายการ"}]');
            // myDatatable.init(dataJSONArray);
            myDatatable.init(API_DOCTYPE_LIST);
        });
        super.unblockui('#m-content');

    }

    // add() {
    //     this._router.navigate(['/trn/payment/detail/0']);

    // }

    // del() {
    //     super.blockui('#m-content');
    //     let paymentId = $('#docTypeCodeDeleteSelected').val();
    //     this._paymentService.del(paymentId.toString()).subscribe(resp => {

    //         super.showsuccess(paymentId + ' delete complete');
    //         myDatatable.reload();
    //     },
    //         error => {    
    //             super.showError(error);
    //             super.unblockui('#m-content');
    //             console.log('error');
    //         },
    //         () => {
    //             super.unblockui('#m-content');
    //             console.log('done');
    //         });
    // }

    // navigate_edit(docTypeCode) {
    //     this._router.navigate(['/masters/doctype/detail/' + docTypeCode]);
    // }
}   