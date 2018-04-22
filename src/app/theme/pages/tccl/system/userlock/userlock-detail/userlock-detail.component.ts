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
import { forEach } from '@angular/router/src/utils/collection';
import { Subject } from 'rxjs';
import { UserLockService } from '../../../_services/system/userlock.service';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { SPECIAL_USER_ADMIN, SPECIAL_USER_OWNER } from '../../../../../../app-constants';
import { UserLock } from '../../../_models/system/userlock';


@Component({
    selector: "system-userlock-detail",
    templateUrl: "./userlock-detail.component.html",
    styleUrls: ["./userlock-detail.component.css"]

})

export class UserLockDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public userlock: UserLock;
    public id: any;

    public userList: any;
    public textSearchUser: string;
    public textSearchADUser: string;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();
    public showDropDownUser = false;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _userlockService: UserLockService,
        private _adUserService: ADUserService,
        private formBuilder: FormBuilder) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchUser = md;
            this.searchUser(md);
        })
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        this.route.params.subscribe(params => {
            console.log(params['id']);
            this.id = params['id'];
        });
        // console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._userlockService.get<any>(this.id).subscribe(resp => {
                if (resp.is_error) {
                    super.showError(resp.error_msg);
                    super.unblockui('#m_form_1');
                } else {
                    this.userlock = resp.data;

                    this.textSearchUser = this.userlock.ad_username;
                    this.textSearchADUser = this.userlock.ad_user;

                    super.unblockui('#m_form_1');
                }
            });
        } else {
            this.userlock = new UserLock();
            super.unblockui('#m_form_1');
        }

    }

    ngAfterViewInit() {
        /* this._script.loadScripts('config-specialuser-detail',
            ['assets/tccl/config/specialuser/specialuser-detail.js']); */
    }

    save() {
        // console.log(this.routeapprove);
        this.create();
    }

    fillData(isInsert: boolean) {
        this.userlock.status = true;

        this.userlock.update_user = super.getADUserLogin();
        this.userlock.update_username = super.getFullNameUserLogin();
        this.userlock.update_datetime = new Date();

        if (isInsert) {
            this.userlock.create_user = this.userlock.update_user;
            this.userlock.create_username = this.userlock.update_username;
            this.userlock.create_datetime = this.userlock.update_datetime;
        }
    }

    create() {
        super.blockui('#m_form_1');

        this.fillData(true);

        this._userlockService.create<any>(this.userlock).subscribe(resp => {
            if (resp.is_error == false) {
                // console.log(resp);
                this.userlock = resp.data;
                super.showsuccess('User: ' + this.userlock.ad_user + ' create complete');
                // this.navigate_new();
                this.clearForm();
                // window.location.reload();
                super.unblockui('#m_form_1');
            } else {
                super.showError(resp.error_msg);
                super.unblockui('#m_form_1');
            }
        },
            error => {
                alert(error);
                super.showError(error);
                super.unblockui('#m_form_1');
            },
            () => {
                super.unblockui('#m_form_1');
            });
    }

    clearForm() {
        this.userlock = new UserLock();
        this.textSearchUser = '';
        this.textSearchADUser = '';
    }

    navigate_new() {
        this._router.navigate(['/system/userlock/detail/0']);
    }

    navigate_list() {
        this._router.navigate(['/system/userlock/list']);
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
        this.userlock.ad_user = value.ad_user;
        this.userlock.ad_username = value.fullname;

        this.textSearchUser = value.fullname
        this.textSearchADUser = value.ad_user;
        this.showDropDownUser = false;
    }

    closeDropDown() {
        this.showDropDownUser = false;
    }

    isValid() {
        if (this.userlock.ad_user != null && this.userlock.ad_user != ''
            && this.userlock.ad_username != null && this.userlock.ad_username != '') {
            return true;
        } else {
            return false;
        }
    }

}