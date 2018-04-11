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
import { SpecialUser } from '../../../_models/config/specialuser';
import { SpecialUserService } from '../../../_services/config/specialuser.service';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { SPECIAL_USER_ADMIN, SPECIAL_USER_OWNER } from '../../../../../../app-constants';


@Component({
    selector: "config-specialuser-detail",
    templateUrl: "./specialuser-detail.component.html",
    styleUrls: ["./specialuser-detail.component.css"]

})

export class SpecialUserDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public specialuser: SpecialUser;
    public id: any;
    public specialuser_type: any;

    public userList: any;
    public textSearchUser: string;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();

    public showDropDownUser = false;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _specialuserService: SpecialUserService,
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
            if (params['id'] + '' == SPECIAL_USER_ADMIN.showname) {
                this.specialuser_type = SPECIAL_USER_ADMIN;
                this.id = '0';
                console.log('admin');
            } else if (params['id'] + '' == SPECIAL_USER_OWNER.showname) {
                this.specialuser_type = SPECIAL_USER_OWNER;
                this.id = '0';
                console.log('maintain');
            } else {
                this.id = params['id'];
                console.log('else');
            }
            console.log(this.specialuser_type);
        });
        // console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._specialuserService.get<any>(this.id).subscribe(resp => {
                if (resp.is_error) {
                    super.showError(resp.error_msg);
                    super.unblockui('#m_form_1');
                } else {
                    this.specialuser = resp.data;

                    switch (this.specialuser.roles.toLowerCase()) {
                        case SPECIAL_USER_ADMIN.dbname:
                            this.specialuser = SPECIAL_USER_ADMIN;
                            break;
                        case SPECIAL_USER_ADMIN.dbname:
                            this.specialuser = SPECIAL_USER_OWNER;
                            break;
                    }

                    this.textSearchUser = this.specialuser.ad_username;

                    super.unblockui('#m_form_1');
                }
            });
        } else {
            this.specialuser = new SpecialUser();
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
        this.specialuser.roles = this.specialuser_type.dbname.toUpperCase();
        this.specialuser.status = true;

        this.specialuser.update_user = super.getADUserLogin();
        this.specialuser.update_username = super.getFullNameUserLogin();
        this.specialuser.update_datetime = new Date();

        if (isInsert) {
            this.specialuser.create_user = this.specialuser.update_user;
            this.specialuser.create_username = this.specialuser.update_username;
            this.specialuser.create_datetime = this.specialuser.update_datetime;
        }
    }

    create() {
        super.blockui('#m_form_1');

        this.fillData(true);

        this._specialuserService.create<any>(this.specialuser).subscribe(resp => {
            if (resp.is_error == false) {
                // console.log(resp);
                this.specialuser = resp.data;
                super.showsuccess('User: ' + this.specialuser.ad_user + ' create complete');
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
        this.specialuser = new SpecialUser();
        this.textSearchUser = '';
    }

    navigate_new() {
        this._router.navigate(['/config/user/detail/' + this.specialuser_type.showname]);
    }

    navigate_list() {
        this._router.navigate(['/config/user/' + this.specialuser_type.showname + '/' + this.specialuser_type.showname]);
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
        this.specialuser.ad_user = value.ad_user;
        this.specialuser.ad_username = value.fullname;

        this.textSearchUser = value.fullname
        this.showDropDownUser = false;
    }

    closeDropDown() {
        this.showDropDownUser = false;
    }

    isValid() {
        if (this.specialuser.ad_user != null && this.specialuser.ad_user != ''
            && this.specialuser.ad_username != null && this.specialuser.ad_username != '') {
            return true;
        } else {
            return false;
        }
    }

}