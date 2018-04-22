import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { UserLockService } from '../../../_services/system/userlock.service';
import { API_USERLOCK_LIST } from './../../../../../../app-constants';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "system-userlock-list",
    templateUrl: "./userlock-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UserLockListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_user_id: any;
    public action_ad_user: string;
    public api_list: string;

    public m_text_search: any;

    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _userlockService: UserLockService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.prepare_del = this.prepare_del.bind(this);
        this.api_list = API_USERLOCK_LIST;
    }

    ngAfterViewInit() {
        this._script.loadScripts('system-userlock-list',
            ['assets/tccl/system/userlock/userlock-list.js']);
        // console.log(this.api_list);
        this.load(this.api_list);
    }

    load(url) {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(url);
        });
        super.unblockui('#m-content');
    }

    prepare_del(userId, adUser) {
        this.action_user_id = userId;
        this.action_ad_user = adUser;
        // console.log(this.action_user_id);
    }

    del() {
        super.blockui('#m-content');
        this._userlockService.del(this.action_user_id.toString()).subscribe(resp => {
            console.log(resp);
            if (resp.is_error) {
                super.showError(resp.error_msg);
                super.unblockui('#m-content');
            } else {
                super.showsuccess(this.action_ad_user + ' delete complete');
                myDatatable.reload();
                super.unblockui('#m-content');
            }
        },
            error => {
                // console.log('error');
                super.showError(error);
                super.unblockui('#m-content');
            },
            () => {
                // console.log('done');
                super.unblockui('#m-content');
            });
    }

    navigate_add() {
        this._router.navigate(['/system/userlock/detail/0']);
    }

    navigate_list() {
        this._router.navigate(['/system/userlock/list']);
    }

    search() {
        // console.log('do search');
        super.blockui('#m-content');
        myDatatable.search();
        super.unblockui('#m-content');
    }

}   