import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { CompanyService } from './../../_services/company.service';
import { API_COMPANY_LIST } from './../../../../../../app-constants';



declare var myDatatable_company: any;
declare var window: any

@Component({
    selector: "master-company-list",
    templateUrl: "./company-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class CompanyListComponent extends PageBaseComponent implements OnInit, AfterViewInit {


    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _companyService: CompanyService) {
        super();
    }
    ngOnInit() {

        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
    }
    ngAfterViewInit() {

        this._script.loadScripts('master-company-list',
            ['assets/tccl/masters/company/company-list.js']);

        this.load();

    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable_company.init(API_COMPANY_LIST);
        });
        super.unblockui('#m-content');

    }

    add() {
        this._router.navigate(['/masters/company/detail/0']);

    }

    del() {

        super.blockui('#m-content');
        let compCode = $('#comCodeDeleteSelected').val();
        this._companyService.del(compCode.toString()).subscribe(resp => {

            super.showsuccess(compCode + ' delete complete');
            myDatatable_company.reload();
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

    navigate_edit(compCode) {
        this._router.navigate(['/masters/company/detail/' + compCode]);
    }
}   