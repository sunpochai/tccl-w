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
import { RouteApproveService } from '../../../_services/config/routeapprove.service';
import { RouteApprove } from '../../../_models/config/routeapprove';
import { ROUTE_PR, ROUTE_PO, ROUTE_PA, API_USER_LIST, API_TRACKING_GET_PUT_DEL, C_DOC_STATUS_REVIEWED, ROUTE_NPO } from '../../../../../../app-constants';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { RouteApproveDetail } from '../../../_models/config/routeapprovedetail';
import { forEach } from '@angular/router/src/utils/collection';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { SortPipe } from '../../../../../../_pipe/sort';



@Component({
    selector: "config-route-detail",
    templateUrl: "./route-detail.component.html",
    styleUrls: ["./route-detail.component.css"]

})

export class RouteApproveDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public stateForm: FormGroup;
    public routeapprove: RouteApprove;
    public id: any;
    public routetype: any;
    public doctypeList: Array<DocType>;
    public trackingNumberList: Array<Tracking>;
    /* public priceoverpr_yes: boolean;
    public priceoverpr_no: boolean; */

    public action_type: any;
    public action_index: number;

    public maxValPlaceholder: string = "Enter Maximum Value";
    public maxValCaption: string = "*";
    public unlimit_maximum;
    public last_approver: string;
    /* 
        public trackingList : any;
        public textSearchTrackCode:string;
        public txtSearchTrackingChanged:Subject<string> = new Subject<string>();
        public showDropDownTracking = false; */

    public userList: any;
    public txtAdUserSelected;
    public txtAdUserNameSelected;
    public textSearchUser: string;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();
    public showDropDownUser = false;

    public sortBy = 'tracking_code';
    public sortType = -1;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _routeapproveService: RouteApproveService,
        private _doctypeService: DocTypeService,
        private formBuilder: FormBuilder,
        private _trackingService: TrackingService,
        private _adUserService: ADUserService) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchUser = md;
            this.searchUser(md);
        })
        /* 
                this.txtSearchTrackingChanged.debounceTime(500).distinctUntilChanged().subscribe(md=>{
                    this.textSearchTrackCode  = md;
                    this.searchTracking(md);
                }) */
    }


    ngOnInit() {
        super.blockui('#m_form_1');
        this.route.params.subscribe(params => {
            //id:any ('pr','po','pa','npo' <-- add new record ,id <-- get old record)
            if (params['id'] + '' == ROUTE_PR.name) {
                this.routetype = ROUTE_PR;
            } else if (params['id'] + '' == ROUTE_PO.name) {
                this.routetype = ROUTE_PO;
            } else if (params['id'] + '' == ROUTE_PA.name) {
                this.routetype = ROUTE_PA;
            } else if (params['id'] + '' == ROUTE_NPO.name) {
                this.routetype = ROUTE_NPO;
            } else {
                this.id = params['id'];
            }
        });

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        if (this.routetype == ROUTE_NPO) {
            this._trackingService.getnpoall().subscribe(resp => {
                this.trackingNumberList = resp;
                // console.log(data);
            });
        } else {
            this._trackingService.getall().subscribe(resp => {
                this.trackingNumberList = resp;
                // console.log(data);
            });
        }

        if (this.id != null && this.id != '0') {
            this._routeapproveService.get<RouteApprove>(this.id).subscribe(data => {
                this.routeapprove = data;
                switch (this.routeapprove.doc_group) {
                    case ROUTE_PR.doc_group:
                        this.routetype = ROUTE_PR;
                        break;
                    case ROUTE_PO.doc_group:
                        this.routetype = ROUTE_PO;
                        break;
                    case ROUTE_PA.doc_group:
                        this.routetype = ROUTE_PA;
                        break;
                    case ROUTE_NPO.doc_group:
                        this.routetype = ROUTE_NPO;
                        break;
                }

                this.last_approver = this.routeapprove.number_approver_sap + '';

                /* this.priceoverpr_yes = (this.routeapprove.price_over_pr_flag == 'A' || this.routeapprove.price_over_pr_flag == 'Y');
                this.priceoverpr_no = (this.routeapprove.price_over_pr_flag == 'A' || this.routeapprove.price_over_pr_flag == 'N'); */
                /* this.textSearchTrackCode = this.routeapprove.tracking_no; */
                // console.log(this.routeapprove);
                // console.log(this.routetype);

                if (this.routeapprove.doc_group != ROUTE_PR.doc_group && this.routeapprove.maximum_value == 9999999999999.99) {
                    this.unlimit_maximum = true;
                    this.routeapprove.maximum_value = null;
                    this.maxValPlaceholder = "Maximum Value Unlimited";
                }

                //call again to get NPO tracking list (replace other type tracking list)
                if (this.routetype == ROUTE_NPO) {
                    this._trackingService.getnpoall().subscribe(resp => {
                        this.trackingNumberList = resp;
                        // console.log(data);
                    });
                }        

                super.unblockui('#m_form_1');
            });
        } else {
            this.routeapprove = new RouteApprove();
            this.routeapprove.tracking_no = '';
            this.routeapprove.doc_type = '';
            // console.log(this.routeapprove);
            super.unblockui('#m_form_1');
        }

    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-detail',
            ['assets/tccl/config/route/route-detail.js']);
    }

    save() {
        if (this.validateData() == false) {
            return;
        }

        // console.log(this.routeapprove);
        // console.log(this.routeapprove.number_approver_sap);

        if (this.routeapprove.route_id != null && this.routeapprove.route_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    validateData(): boolean {
        // console.log(this.unlimit_maximum);

        if (this.unlimit_maximum) {
            this.routeapprove.maximum_value = 9999999999999.99;
        }

        if (this.routetype.doc_group != ROUTE_PR.doc_group && this.routeapprove.minimum_value > this.routeapprove.maximum_value) {
            super.showError('Invalid minimum and maximum value');
            return false;
        }

        // console.log(this.priceoverpr_yes);
        // console.log(this.priceoverpr_no);

        /* if (this.routetype.doc_group == ROUTE_PO.doc_group && this.priceoverpr_yes == null && this.priceoverpr_no == null) {
            super.showError('Please specify Price Over PR');
            return false;
        } */

        return true;
    }

    fillData(isCreate: boolean) {
        if (this.routeapprove.doc_group == ROUTE_PO.doc_group) {
            this.routeapprove.number_approver_sap = parseInt(this.last_approver);
        } else {
            this.routeapprove.number_approver_sap = 0;
        }

        this.routeapprove.price_over_pr_flag = 'A';

        this.routeapprove.update_user = super.getADUserLogin();
        this.routeapprove.update_username = super.getFullNameUserLogin();
        this.routeapprove.update_datetime = new Date();

        if (isCreate) {
            this.routeapprove.route_status = true;

            this.routeapprove.create_user = this.routeapprove.update_user;
            this.routeapprove.create_username = this.routeapprove.update_username;
            this.routeapprove.create_datetime = this.routeapprove.update_datetime;
        }

        /** detail data will get the same time as header */
        for (let index in this.routeapprove.cf_route_detail) {
            this.routeapprove.cf_route_detail[index].create_user = this.routeapprove.update_user;
            this.routeapprove.cf_route_detail[index].create_username = this.routeapprove.update_username;
            this.routeapprove.cf_route_detail[index].create_datetime = this.routeapprove.update_datetime;
        }

    }

    create() {
        super.blockui('#m_form_1');

        this.routeapprove.doc_group = this.routetype.doc_group;

        if (this.routetype.doc_group == ROUTE_PR.doc_group) {
            this.routeapprove.minimum_value = 0;
            this.routeapprove.maximum_value = 999999999999.99;
        } else if (this.routetype.doc_group == ROUTE_PA.doc_group || this.routetype.doc_group == ROUTE_NPO.doc_group) {
            this.routeapprove.doc_type = 'NB';
        } else {
            this.routeapprove.account = 'A';
        }

        this.fillData(true);

        this._routeapproveService.create<any>(this.routeapprove).subscribe(resp => {
            // console.log(resp);
            if (resp.is_error == false) {
                this.routeapprove = resp.data;
                super.showsuccess(this.routeapprove.route_name + ' create complete');
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

        this._routeapproveService.put<any>(this.routeapprove).subscribe(resp => {
            if (resp.is_error == false) {
                this.routeapprove = resp.data;
                super.showsuccess(this.routeapprove.route_name + ' update complete');
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

    prepareAddApprover() {
        this.action_type = 'add';
        this.action_index = -1;
        this.textSearchUser = '';
        this.txtAdUserSelected = '';
        this.txtAdUserNameSelected = '';
    }

    prepareEditApprover(rowIndex: number) {
        this.action_type = 'edit';
        this.action_index = rowIndex;
        this.textSearchUser = this.routeapprove.cf_route_detail[rowIndex].ad_username;
        this.txtAdUserSelected = this.routeapprove.cf_route_detail[rowIndex].ad_user;
        this.txtAdUserNameSelected = this.routeapprove.cf_route_detail[rowIndex].ad_username;
    }

    approverAction() {
        if (this.action_type == "edit") {
            this.editApprover(this.action_index);
            // console.log(this.action_index);
        } else {
            this.addApprover();
        }
    }

    addApprover() {
        if (this.routeapprove.cf_route_detail == null) {
            this.routeapprove.cf_route_detail = new Array<RouteApproveDetail>();
        } else {

            for (let row of this.routeapprove.cf_route_detail) {
                if (row.ad_user == this.txtAdUserSelected) {
                    super.showError('Duplicate approver name');
                    return;
                }
            }
        }

        let approver: RouteApproveDetail = new RouteApproveDetail;
        approver.route_id = this.routeapprove.route_id;
        approver.route_d_id = null;

        approver.route_level = this.routeapprove.cf_route_detail.length + 1;
        approver.ad_user = this.txtAdUserSelected;
        approver.ad_username = this.txtAdUserNameSelected;

        // console.log(approver);
        this.routeapprove.cf_route_detail.push(approver);
        // console.log(this.routeapprove);
    }

    editApprover(rowIndex: number) {
        this.routeapprove.cf_route_detail[rowIndex].ad_user = this.txtAdUserSelected;
        this.routeapprove.cf_route_detail[rowIndex].ad_username = this.txtAdUserNameSelected;
    }

    removeApprover(rowIndex: number) {
        let tempApprovers: Array<RouteApproveDetail> = new Array<RouteApproveDetail>();
        let index: number = 0;

        if (this.routeapprove.cf_route_detail != null && this.routeapprove.cf_route_detail.length >= rowIndex) {
            for (let row of this.routeapprove.cf_route_detail) {
                if (rowIndex == index) {
                    //do nothing: row that want to remove from array
                } else {
                    row.route_level = tempApprovers.length + 1;
                    tempApprovers.push(row);
                }
                // console.log(row);
                index++;
            }
        }
        // console.log(tempApprovers);
        this.routeapprove.cf_route_detail = tempApprovers;
    }

    navigate_back() {
        this._router.navigate(['/config/route/list/' + this.routetype.name + '/' + this.routetype.name + '/back']);
    }
    navigate_list() {
        this._router.navigate(['/config/route/list/' + this.routetype.name + '/' + this.routetype.name + '/init']);
    }


    /* searchTracking(search) {
        if(search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownTracking = true;
        this._trackingService.search(this.textSearchTrackCode).subscribe(x=>  {
            this.trackingList = x
        });  
    } */

    searchUser(search) {
        if (search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownUser = true;
        this._adUserService.search(search).subscribe(x => {
            this.userList = x
        });
    }

    /* onChangeSearchTracking(event){
        // console.log(event);
        this.txtSearchTrackingChanged.next(event);
    } */
    onChangeSearchUser(event) {
        // console.log(event);
        this.txtSearchUserChanged.next(event);
    }

    /* selectTrackingValue(value) {
        this.textSearchTrackCode = value.tracking_code 
        this.routeapprove.tracking_no = value.tracking_code;
        
        this.showDropDownTracking = false;
    } */

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

    toggleUnlimit() {
        if (this.maxValPlaceholder == "Enter Maximum Value") {
            this.maxValPlaceholder = "Maximum Value Unlimited"
            this.maxValCaption = "";
            this.routeapprove.maximum_value = null;
        } else {
            this.maxValPlaceholder = "Enter Maximum Value"
            this.maxValCaption = "*";
        }

    }

    /* isTrackingCodeValid(): boolean {
        // console.log(this.routeapprove.tracking_no);
        if (this.routeapprove.tracking_no != null && this.routeapprove.tracking_no != '') {
            return true;
        }

        return false;
    } */


}