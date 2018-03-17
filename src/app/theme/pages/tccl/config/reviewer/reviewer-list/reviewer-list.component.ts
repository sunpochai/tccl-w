import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { ReviewerService } from '../../../_services/config/reviewer.service';
import { API_REVIEWER_LIST } from './../../../../../../app-constants';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "config-reviewer-list",
    templateUrl: "./reviewer-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ReviewerListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_review_id: any;
    public action_sap_code: any;

    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _reviewerService: ReviewerService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.prepare_del = this.prepare_del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-reviewer-list', 
            ['assets/tccl/config/reviewer/reviewer-list.js']);

        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_REVIEWER_LIST);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/config/reviewer/detail/0']);
    }

    prepare_del(reviewId, sapCode) {
        this.action_review_id = reviewId;
        this.action_sap_code = sapCode;
        console.log(this.action_review_id);
    }

    del() {
        super.blockui('#m-content');
        this._reviewerService.del(this.action_review_id.toString()).subscribe(resp => {
            super.showsuccess(this.action_sap_code + ' delete complete');
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

    navigate_edit(routeId) {
        this._router.navigate(['/config/reviewer/detail/' + routeId]);
    }

    navigate_list() {
        this._router.navigate(['/config/reviewer/list/']);
    }

    search() {
        console.log('do search');
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   