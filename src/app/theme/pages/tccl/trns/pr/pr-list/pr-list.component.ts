import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { PRService } from './../../../_services/trns/pr.service';
import { API_PR_LIST } from './../../../../../../app-constants';



declare var myDatatable: any;
declare var window: any

@Component({
    selector: "trns-pr-list",
    templateUrl: "./pr-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PRListComponent extends PageBaseComponent implements OnInit, AfterViewInit {

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _pRService: PRService) {
        super();
    }
    ngOnInit() {

        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        // window.my.namespace.del = this.del.bind(this);
        // window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
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

    navigate_edit(prId) {
        this._router.navigate(['/trns/pr/detail/' + prId]);
    }

    navigate_review(prId) {
        this._router.navigate(['/trns/pr/detail/' + prId]);
    }

    navigate_approve(prId) {
        this._router.navigate(['/trns/pr/detail/' + prId]);
    }
}   