import { PageBaseComponent } from './../../../pagebase.component';
import { CompanyService } from './../../../_services/masters/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../../_models/masters/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../_models/masters/company';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { API_DELEGATE_INSERT, API_DELEGATE_GET_PUT_DEL, API_USER_LIST } from '../../../../../../app-constants';
import { forEach } from '@angular/router/src/utils/collection';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { SortPipe } from '../../../../../../_pipe/sort';
import { DelegateService } from '../../../_services/config/delegate.service';
import { Delegate } from '../../../_models/config/delegate';
import { DelegateDetail } from '../../../_models/config/delegatedetail';
import { StringUtil } from '../../../../../../Util/stringutil';
import { DateUtil } from '../../../../../../Util/dateutil';

declare var myData: any;

@Component({
    selector: "config-delegate-detail",
    templateUrl: "./delegate-detail.component.html",
    styleUrls: ["./delegate-detail.component.css"]

})

export class DelegateDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    // public stateForm: FormGroup;
    public id: any;
    public delegate: Delegate;
    public start_date: string;
    public end_date: string;

    public action_type: any;
    public action_index: number;

    public userList: any;
    public txtAdUserSelected;
    public txtAdUserNameSelected;
    public textSearchUser: string;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();
    public showDropDownUser = false;

    public ownerList: any;
    public txtOwnerSelected;
    public txtOwnerNameSelected;
    public textSearchOwner: string;
    public txtSearchOwnerChanged: Subject<string> = new Subject<string>();
    public showDropDownOwner = false;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _delegateService: DelegateService,
        private formBuilder: FormBuilder,
        private _adUserService: ADUserService) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchUser = md;
            this.searchUser(md);
        })

        this.txtSearchOwnerChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchOwner = md;
            this.searchOwner(md);
        })

    }


    ngOnInit() {
        // console.log('ngOnInit');
        super.blockui('#m_form_1');

        this.route.params.subscribe(params => {
            this.id = params['id'] + '';

            if (this.id != null && this.id != '0') {
                this._delegateService.get<any>(this.id).subscribe(resp => {
                    // console.log(resp);

                    if (resp.is_error) {
                        console.log(resp);
                        super.showError(resp.error_msg);

                        super.unblockui('#m_form_1');
                    } else {
                        this.delegate = resp.data;

                        this.textSearchOwner = this.delegate.ad_username;
                        this.txtOwnerSelected = this.delegate.ad_user;
                        this.txtOwnerNameSelected = this.delegate.ad_username;

                        this.start_date = DateUtil.toDisplayDate(this.delegate.start_date);
                        this.end_date = DateUtil.toDisplayDate(this.delegate.end_date);

                        super.unblockui('#m_form_1');
                    }
                },
                    error => {
                        super.showError(error);
                        // console.log('error');
                        super.unblockui('#m_form_1');
                    },
                    () => {
                        super.unblockui('#m_form_1');
                        // console.log('done');
                    });
            } else {
                this.delegate = new Delegate();

                /** Default owner by AD User Login */
                this.textSearchOwner = super.getFullNameUserLogin();
                this.txtOwnerSelected = super.getADUserLogin();
                this.txtOwnerNameSelected = super.getFullNameUserLogin();

                this.delegate.ad_user = this.txtOwnerSelected;
                this.delegate.ad_username = this.txtOwnerNameSelected;
                /** ------------------------------ */

                console.log(this.delegate);
                super.unblockui('#m_form_1');
            }
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-delegate-detail',
            ['assets/tccl/config/delegate/delegate-detail.js']);
        this.load();
    }

    load() {
        super.blockui('#m_form_1');
        jQuery(document).ready(function() {
            setTimeout(
                function() {
                    myData.init();
                }, 1200
            );
        });
        super.unblockui('#m_form_1');
    }

    save() {
        if (this.validateData() == false) {
            return;
        }

        // console.log(this.start_date);
        // console.log(this.end_date);

        this.delegate.start_date = DateUtil.toInternalDate(this.start_date);
        this.delegate.end_date = DateUtil.toInternalDate(this.end_date);

        // console.log(this.delegate.start_date);
        // console.log(this.delegate.end_date);

        if (this.delegate.delegate_id != null && this.delegate.delegate_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    validateData(): boolean {
        var date_from = DateUtil.toInternalDate(this.start_date);
        var date_to = DateUtil.toInternalDate(this.end_date);

        if (date_from.getTime() > date_to.getTime()) {
            super.showError('Invalid date range!');
            super.unblockui('#m-content');
            return;
        }

        return true;
    }

    fillData(isCreate: boolean) {
        this.delegate.update_user = super.getADUserLogin();
        this.delegate.update_username = super.getFullNameUserLogin();
        this.delegate.update_datetime = new Date();

        if (isCreate) {
            this.delegate.create_user = this.delegate.update_user;
            this.delegate.create_username = this.delegate.update_username;
            this.delegate.create_datetime = this.delegate.update_datetime;
        }
    }

    create() {
        super.blockui('#m_form_1');

        this.fillData(true);

        console.log(this.delegate);

        this._delegateService.create<any>(this.delegate).subscribe(resp => {
            // console.log(resp);
            if (resp.is_error == false) {
                this.delegate = resp.data;
                super.showsuccess('Delegate for user: ' + this.delegate.ad_user + ' create complete');
                super.unblockui('#m_form_1');
                this.navigate_list();
            } else {
                super.showError(resp.error_msg);
                super.unblockui('#m_form_1');
            }
        },
            error => {
                // alert(error);
                super.showError(error);
                super.unblockui('#m_form_1');
            },
            () => {
                super.unblockui('#m_form_1');
            });
    }

    update() {
        super.blockui('#m_form_1');

        this.fillData(false);
        console.log(this.delegate);

        this._delegateService.put<any>(this.delegate).subscribe(resp => {
            if (resp.is_error == false) {
                this.delegate = resp.data;
                super.showsuccess('Delegate for user: ' + this.delegate.ad_user + ' update complete');
                super.unblockui('#m_form_1');
                this.navigate_list();
            } else {
                super.showError(resp.error_msg);
                super.unblockui('#m_form_1');
            }
        },
            error => {
                super.showError(error);
                super.unblockui('#m_form_1');
            },
            () => {
                super.unblockui('#m_form_1');
            });
    }

    prepareAddDelegates() {
        this.action_type = 'add';
        this.action_index = -1;
        this.textSearchUser = '';
        this.txtAdUserSelected = '';
        this.txtAdUserNameSelected = '';
    }

    prepareEditDelegates(rowIndex: number) {
        this.action_type = 'edit';
        this.action_index = rowIndex;
        this.textSearchUser = this.delegate.cf_delegate_users[rowIndex].delegate_ad_username;
        this.txtAdUserSelected = this.delegate.cf_delegate_users[rowIndex].delegate_ad_user;
        this.txtAdUserNameSelected = this.delegate.cf_delegate_users[rowIndex].delegate_ad_username;
    }

    delegatesAction() {
        if (this.action_type == "edit") {
            this.editDelegates(this.action_index);
            // console.log(this.action_index);
        } else {
            this.addDelegates();
        }
    }

    addDelegates() {
        if (this.delegate.cf_delegate_users == null) {
            this.delegate.cf_delegate_users = new Array<DelegateDetail>();
        } else {

            for (let row of this.delegate.cf_delegate_users) {
                if (row.delegate_ad_user == this.txtAdUserSelected) {
                    super.showError('Duplicate approver name');
                    return;
                }
            }
        }

        let delegates: DelegateDetail = new DelegateDetail;
        delegates.delegate_id = this.delegate.delegate_id;
        delegates.delegate_d_id = null;

        delegates.delegate_ad_user = this.txtAdUserSelected;
        delegates.delegate_ad_username = this.txtAdUserNameSelected;

        this.delegate.cf_delegate_users.push(delegates);
        console.log(this.delegate);
    }

    editDelegates(rowIndex: number) {
        this.delegate.cf_delegate_users[rowIndex].delegate_ad_user = this.txtAdUserSelected;
        this.delegate.cf_delegate_users[rowIndex].delegate_ad_username = this.txtAdUserNameSelected;
        console.log(this.delegate);
    }

    removeDelegates(rowIndex: number) {
        let tempDelegates: Array<DelegateDetail> = new Array<DelegateDetail>();
        let index: number = 0;

        if (this.delegate.cf_delegate_users != null && this.delegate.cf_delegate_users.length >= rowIndex) {
            for (let row of this.delegate.cf_delegate_users) {
                if (rowIndex == index) {
                    //do nothing: row that want to remove from array
                } else {
                    tempDelegates.push(row);
                }
                // console.log(row);
                index++;
            }
        }
        // console.log(tempApprovers);
        this.delegate.cf_delegate_users = tempDelegates;
        console.log(this.delegate);
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
        this.txtOwnerNameSelected = value.fullname;

        this.delegate.ad_user = this.txtOwnerSelected;
        this.delegate.ad_username = this.txtOwnerNameSelected;

        this.showDropDownOwner = false;
    }

    closeDropDownOwner() {
        this.showDropDownOwner = false;
    }

    searchUser(search) {
        if (search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownUser = true;
        this._adUserService.search(search).subscribe(x => {
            this.userList = x
        });
    }

    onChangeSearchUser(event) {
        // console.log(event);
        this.txtSearchUserChanged.next(event);
    }

    selectUserValue(value) {
        this.textSearchUser = value.fullname
        this.txtAdUserSelected = value.ad_user;
        this.txtAdUserNameSelected = value.fullname;
        this.showDropDownUser = false;
    }

    closeDropDown() {
        /* this.showDropDownTracking = false; */
        this.showDropDownUser = false;
    }

    onChangeStartDate(event) {
        console.log(event);
    }

    onChangeEndDate(event) {
        console.log(event);
    }

}