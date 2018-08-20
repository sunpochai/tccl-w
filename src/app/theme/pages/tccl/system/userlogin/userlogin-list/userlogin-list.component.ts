import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_USERLOGIN_LIST } from './../../../../../../app-constants';

declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "system-userlogin-list",
    templateUrl: "./userlogin-list.component.html",
    encapsulation: ViewEncapsulation.None
})
export class UserLoginListComponent extends PageBaseComponent implements OnInit, AfterViewInit {

    constructor(private _router: Router,
        private _script: ScriptLoaderService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
    }

    ngAfterViewInit() {
        this._script.loadScripts('system-userlogin-list',
            ['assets/tccl/system/userlogin/userlogin-list.js']);
        this.load();
    }

    load() {
        super.blockui('#m-content');

        jQuery(document).ready(function() {
            myDatatable.init(API_USERLOGIN_LIST);
        });

        super.unblockui('#m-content');
    }

    search() {
        super.blockui('#m-content');

        var dd_from = $('#register_date_from').val().toString().split('/');
        var dd_to = $('#register_date_to').val().toString().split('/');

        var date_from = new Date(parseInt(dd_from[2]), parseInt(dd_from[1]), parseInt(dd_from[0]));
        var date_to = new Date(parseInt(dd_to[2]), parseInt(dd_to[1]), parseInt(dd_to[0]));

        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid registered date range!');
            super.unblockui('#m-content');
            return;
        }

        dd_from = $('#last_checkin_date_from').val().toString().split('/');
        dd_to = $('#last_checkin_date_to').val().toString().split('/');

        date_from = new Date(parseInt(dd_from[2]), parseInt(dd_from[1]), parseInt(dd_from[0]));
        date_to = new Date(parseInt(dd_to[2]), parseInt(dd_to[1]), parseInt(dd_to[0]));

        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid last checkin date range!');
            super.unblockui('#m-content');
            return;
        }

        myDatatable.search();
        super.unblockui('#m-content');
    }

}   