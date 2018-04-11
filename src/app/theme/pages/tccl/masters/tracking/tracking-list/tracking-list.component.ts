import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_TRACKING_LIST } from './../../../../../../app-constants';
import { TrackingService } from '../../../_services/masters/tracking.service';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "master-tracking-list",
    templateUrl: "./tracking-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TrackingListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_item: any;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _trackingService: TrackingService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
        window.my.namespace.prepare_del = this.prepareDel.bind(this);
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-tracking-list',
            ['assets/tccl/masters/tracking/tracking-list.js']);

        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_TRACKING_LIST);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/masters/tracking/detail/0']);
    }

    prepareDel(p_action_item) {
        this.action_item = p_action_item;
    }

    del() {
        super.blockui('#m-content');

        this._trackingService.del(this.action_item).subscribe(resp => {
            console.log(resp);
            super.showsuccess(this.action_item + ' delete complete');
            myDatatable.reload();
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

    navigate_edit(trackingCode) {
        this._router.navigate(['/masters/tracking/detail/' + trackingCode]);
    }
}   