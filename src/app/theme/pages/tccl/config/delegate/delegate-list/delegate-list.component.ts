import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_DELEGATE_GET_PUT_DEL, API_DELEGATE_INSERT, API_DELEGATE_LIST } from './../../../../../../app-constants';
import { DelegateService } from '../../../_services/config/delegate.service';


declare var myDatatable: any;
declare var window: any

@Component({
    selector: "config-delegate-list",
    templateUrl: "./delegate-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DelegateListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_delegate_id: string;
    public action_ad_user: string;

    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _delegateService: DelegateService) {
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
        this._script.loadScripts('config-delegate-list', ['assets/tccl/config/delegate/delegate-list.js']);
        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_DELEGATE_LIST);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/config/delegate/detail/0']);
    }

    prepare_del(delegateId,adUser) {
        console.log('prepare_del: '+delegateId+','+adUser);
        this.action_delegate_id = delegateId;
        this.action_ad_user = adUser;
    }

    del() {
        super.blockui('#m-content');
        console.log('del: ' + this.action_delegate_id.toString());
        this._delegateService.del(this.action_delegate_id.toString()).subscribe(resp => {
            console.log(resp);
            if (resp.is_error) {
                super.showError(resp.error_msg);
                super.unblockui('#m-content');
            } else {
                super.showsuccess('Delegate for user: ' + this.action_ad_user + ' delete complete');
                myDatatable.reload();
                super.unblockui('#m-content');
            }
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

    navigate_edit(delegateId) {
        if (delegateId == '') {
            this._router.navigate(['/config/delegate/detail/0']);
        } else {
            this._router.navigate(['/config/delegate/detail/' + delegateId]);
        }
    }

    navigate_list() {
        this._router.navigate(['/config/delegate/list/']);
    }

    search() {
        super.blockui('#m-content');
        
        var dd_from = $('#m_form_date_from').val().toString().split('/');
        var dd_to = $('#m_form_date_to').val().toString().split('/');

        var date_from = new Date(parseInt(dd_from[2]),parseInt(dd_from[1]),parseInt(dd_from[0]));
        var date_to = new Date(parseInt(dd_to[2]),parseInt(dd_to[1]),parseInt(dd_to[0]));

        // console.log(date_from.getTime());
        // console.log(date_to.getTime());

        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid date range!');
            super.unblockui('#m-content');
            return;
        }

        myDatatable.search();
        super.unblockui('#m-content');
    }

}   