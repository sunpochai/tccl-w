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
import { Reviewer } from '../../../_models/config/reviewer';
import { ReviewerService } from '../../../_services/config/reviewer.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';



@Component({
    selector: "config-reviewer-detail",
    templateUrl: "./reviewer-detail.component.html",
    styleUrls: ["./reviewer-detail.component.css"]

})

export class ReviewerDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public reviewer: Reviewer;
    public id: any;

    public userList: any;
    public textSearchUser: string;
    public textSearchADUser: string;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();

    public showDropDownUser = false;
    public input_sap_group: string;
    public sap_group: any = [
        { value: '1', name: 'Requisitioner' },
        { value: '2', name: 'Purchasing Group' },
        { value: '3', name: 'User ID' },
        { value: '4', name: 'Goods Recipient' },
        { value: '5', name: 'Plant (Last Payment Reviewer)' }
    ];

    public send_mail_flag: string;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _reviewerService: ReviewerService,
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

        // this._reviewerService.getall().subscribe(data => {
        //     this.doctypeList = data;
        //     // console.log(data);
        // });

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        // console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._reviewerService.get<Reviewer>(this.id).subscribe(data => {
                this.reviewer = data;
                this.input_sap_group = this.reviewer.sap_group + '';
                this.textSearchUser = this.reviewer.ad_username;
                this.textSearchADUser = this.reviewer.ad_user

                if (this.reviewer.send_mail != null) {
                    this.send_mail_flag = (this.reviewer.send_mail ? 'Y' : 'N');
                }

                // console.log(this.reviewer);
                // console.log(this.routetype);
                super.unblockui('#m_form_1');
            });
        } else {
            this.reviewer = new Reviewer();
            this.send_mail_flag = 'Y'; //default 'Yes'
            // console.log(this.routeapprove);
            super.unblockui('#m_form_1');
        }

    }

    ngAfterViewInit() {
        this._script.loadScripts('config-reviewer-detail',
            ['assets/tccl/config/reviewer/reviewer-detail.js']);
    }

    save() {
        // console.log(this.routeapprove);
        if (this.reviewer.review_id != null && this.reviewer.review_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    fillData(isInsert: boolean) {
        this.reviewer.sap_group = parseInt(this.input_sap_group);
        this.reviewer.update_user = super.getADUserLogin();
        this.reviewer.update_username = super.getFullNameUserLogin();
        this.reviewer.update_datetime = new Date();
        this.reviewer.send_mail = (this.send_mail_flag == 'Y');

        if (isInsert) {
            this.reviewer.create_user = this.reviewer.update_user;
            this.reviewer.create_username = this.reviewer.update_username;
            this.reviewer.create_datetime = this.reviewer.update_datetime;
        }
    }

    create() {
        super.blockui('#m_form_1');

        /* this.reviewer.sap_group = parseInt(this.input_sap_group);
        this.reviewer.create_user = super.getADUserLogin();
        this.reviewer.create_username = super.getFullNameUserLogin();
        this.reviewer.create_datetime = new Date();
        this.reviewer.update_user = super.getADUserLogin();
        this.reviewer.update_username = super.getFullNameUserLogin();
        this.reviewer.update_datetime = this.reviewer.create_datetime; */
        this.fillData(true);

        this._reviewerService.create<any>(this.reviewer).subscribe(resp => {
            if (resp.is_error == false) {
                // console.log(resp);
                this.reviewer = resp.data;
                this.navigate_list();
                super.showsuccess('Review id: ' + this.reviewer.sap_code + ' create complete');
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

    update() {
        super.blockui('#m_form_1');

        /* this.reviewer.sap_group = parseInt(this.input_sap_group);
        this.reviewer.update_user = super.getADUserLogin();
        this.reviewer.update_username = super.getFullNameUserLogin();
        this.reviewer.update_datetime = new Date(); */
        this.fillData(false);

        this._reviewerService.put<any>(this.reviewer).subscribe(resp => {
            if (resp.is_error == false) {
                this.reviewer = resp.data;
                this.navigate_list();
                super.showsuccess('Review id: ' + this.reviewer.sap_code + ' update complete');
                super.unblockui('#m_form_1');
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


    navigate_list() {
        this._router.navigate(['/config/reviewer/list/']);
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
        this.reviewer.ad_user = value.ad_user;
        this.reviewer.ad_username = value.fullname;

        this.textSearchUser = value.fullname;
        this.textSearchADUser = value.ad_user;
        this.showDropDownUser = false;
    }

    closeDropDown() {
        this.showDropDownUser = false;
    }

    isValid() {
        if (this.input_sap_group != null
            && this.reviewer.ad_user != null && this.reviewer.ad_user != ''
            && this.reviewer.ad_username != null && this.reviewer.ad_username != ''
            && (this.input_sap_group != '5' || this.send_mail_flag != null)
        ) {
            return true;
        } else {
            return false;
        }
    }

}