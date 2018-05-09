import { ActivatedRoute, Router } from '@angular/router';

import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_DELEGATE_GET_PUT_DEL, API_DELEGATE_INSERT, API_DELEGATE_LIST } from './../../../../../../app-constants';
import { DelegateService } from '../../../_services/config/delegate.service';
import { Subject } from 'rxjs/Subject';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { DateUtil } from '../../../../../../Util/dateutil';


declare var myDatatable: any;
declare var window: any

@Component({
    selector: "config-delegate-list",
    templateUrl: "./delegate-list.component.html",
    styleUrls: ["./delegate-list.component.css"],
    encapsulation: ViewEncapsulation.None,
})
export class DelegateListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_delegate_id: string;
    public action_ad_user: string;
    
    public ownerList: any;
    public textSearchADUser: any;
    public txtOwnerSelected;
    public txtOwnerNameSelected;
    public textSearchOwner: string;
    public txtSearchOwnerChanged: Subject<string> = new Subject<string>();
    public showDropDownOwner = false;

    public dateFrom: any;
    public dateTo: any;

    public canChangeUser = super.CheckAdmin();

    constructor(private _router: Router, private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private _delegateService: DelegateService,
        private _adUserService: ADUserService) {
        super();

        this.txtSearchOwnerChanged.debounceTime(300).distinctUntilChanged().subscribe(md => {
            this.textSearchOwner = md;
            this.searchOwner(md);
        })
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.prepare_del = this.prepare_del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);

        this.textSearchOwner = super.getFullNameUserLogin();
        this.txtOwnerSelected = super.getADUserLogin();
        this.textSearchADUser = this.txtOwnerSelected;
        this.txtOwnerNameSelected = super.getFullNameUserLogin();
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

    clearForm() {
        this.dateFrom = '';
        this.dateTo = '';

        this.textSearchOwner = super.getFullNameUserLogin();
        this.txtOwnerSelected = super.getADUserLogin();
        this.textSearchADUser = this.txtOwnerSelected;
        this.txtOwnerNameSelected = super.getFullNameUserLogin();
    }

    add() {
        this._router.navigate(['/config/delegate/detail/0']);
    }

    prepare_del(delegateId, adUser) {
        console.log('prepare_del: ' + delegateId + ',' + adUser);
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

    searchOwner(search) {
        if (search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownOwner = true;
        this._adUserService.search(search).subscribe(x => {
            this.ownerList = x
        });
    }

    onChangeSearchOwner(event) {
        // console.log(event);
        this.txtSearchOwnerChanged.next(event);
    }

    selectOwnerValue(value) {
        this.textSearchOwner = value.fullname
        this.txtOwnerSelected = value.ad_user;
        this.textSearchADUser = this.txtOwnerSelected;
        this.txtOwnerNameSelected = value.fullname;

        // this.delegate.ad_user = this.txtOwnerSelected;
        // this.delegate.ad_username = this.txtOwnerNameSelected;

        this.showDropDownOwner = false;
    }
    
    search() {
        super.blockui('#m-content');

        if (this.dateFrom != null && this.dateFrom != '' && this.dateTo != null && this.dateTo != '') {
            // console.log(this.dateFrom);
            // console.log(this.dateTo);

            var date_from = DateUtil.toInternalDate(this.dateFrom);
            var date_to = DateUtil.toInternalDate(this.dateTo);
    
            // console.log(date_from.getTime());
            // console.log(date_to.getTime());
    
            if (date_from.getTime() > date_to.getTime()) {
                super.showError('Invalid date range!');
                super.unblockui('#m-content');
                return;
            }
        }

        myDatatable.search();
        super.unblockui('#m-content');
    }

}   