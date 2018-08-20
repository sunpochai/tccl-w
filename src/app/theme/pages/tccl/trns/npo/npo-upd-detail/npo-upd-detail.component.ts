import { PageBaseComponent } from './../../../pagebase.component';
// import { CompanyService } from './../../../_services/masters/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SortPipe } from '../../../../../../_pipe/sort';
// import { Company } from '../../../_models/masters/company';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { API_USER_LIST, API_TRACKING_GET_PUT_DEL, C_DOC_STATUS_REVIEWED } from '../../../../../../app-constants';
// import { DocType } from '../../../_models/masters/doctype';
// import { DocTypeService } from '../../../_services/masters/doctype.service';
// import { RouteApproveDetail } from '../../../_models/config/routeapprovedetail';
import { forEach } from '@angular/router/src/utils/collection';
import { Tracking } from '../../../_models/masters/tracking';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { NPO } from '../../../_models/trns/npo';
import { NPOItem } from '../../../_models/trns/npoitem';
import { NPOService } from '../../../_services/trns/npo.service';

declare var myData: any;

@Component({
    selector: "trns-npo-detail",
    templateUrl: "./npo-upd-detail.component.html",
    styleUrls: ["./npo-upd-detail.component.css"]

})

export class NPOUpdDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public stateForm: FormGroup;
    public npo: NPO;
    public id: any;
    public action_name: string;
    public trackingNumberList: Array<Tracking>;

    public advances_payment: boolean;

    public action_npo_item: NPOItem;
    public action_type: any;
    public action_index: number;

    /* public maxValPlaceholder: string = "Enter Maximum Value";
    public maxValCaption: string = "*";
    public unlimit_maximum;
    public last_approver: string; */

    // public userList: any;
    // public txtAdUserSelected;
    // public txtAdUserNameSelected;
    // public textSearchUser: string;
    // public txtSearchUserChanged: Subject<string> = new Subject<string>();
    // public showDropDownUser = false;

    public sortBy = 'tracking_code';
    public sortType = -1;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _npoService: NPOService,
        private formBuilder: FormBuilder,
        private _trackingService: TrackingService,
        private _adUserService: ADUserService) {
        super();

        // this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
        //     this.textSearchUser = md;
        //     this.searchUser(md);
        // })
    }


    ngOnInit() {
        super.blockui('#m_form_1');

        this._trackingService.getall().subscribe(resp => {
            this.trackingNumberList = resp;
            // console.log(resp);
            // console.log(this.trackingNumberList);
        });

        this.route.params.subscribe(params => {
            //id:any ('0' <-- add new record ,id <-- get old record)
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            console.log('this.id = ' + this.id);

            this.action_name = 'Update';
            this._npoService.get<any>(this.id).subscribe(resp => {
                // console.log(resp);

                if (resp.is_error) {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    // this.fakepa = null;
                    super.unblockui('#m-content');
                } else {
                    this.npo = resp.data;
                    console.log(this.npo);
                    super.unblockui('#m_form_1');
                }
            });
        } else {
            this.action_name = 'Create';
            this.npo = new NPO();
            console.log('else: new item');
            super.unblockui('#m_form_1');
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-npo-upd-detail',
            ['assets/tccl/trns/npo/npo-upd-detail.js']);
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

        // console.log(this.routeapprove);
        // console.log(this.routeapprove.number_approver_sap);

        if (this.npo.payment_n_id != null && this.npo.payment_n_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    validateData(): boolean {
        // console.log(this.unlimit_maximum);
        // console.log(this.priceoverpr_yes);
        // console.log(this.priceoverpr_no);

        return true;
    }

    fillData(isCreate: boolean) {
        this.npo.change_user = super.getADUserLogin();//super.getFullNameUserLogin();
        this.npo.change_date = new Date();

        if (isCreate) {
            this.npo.create_user = this.npo.change_user;
            this.npo.create_date = this.npo.change_date;
        }

        console.log(this.npo);

        /** detail data will get the same time as header */
        /* for (let index in this.npo.trn_payment_n_item) {
            this.npo.trn_payment_n_item[index].create_user = this.npo.update_user;
            this.npo.trn_payment_n_item[index].create_username = this.npo.update_username;
            this.npo.trn_payment_n_item[index].create_datetime = this.npo.update_datetime;
        } */

    }

    create() {
        super.blockui('#m_form_1');

        this.fillData(true);

        this._npoService.save<any>(this.npo).subscribe(resp => {
            console.log(resp);
            if (resp.is_error == false) {
                this.npo = resp.data;
                super.showsuccess('Non-PO created successful: ' + this.npo.subject);
                super.unblockui('#m_form_1');
                // this.navigate_list();
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

        this._npoService.save<any>(this.npo).subscribe(resp => {
            console.log(resp);
            if (resp.is_error == false) {
                this.npo = resp.data;
                super.showsuccess('Non-PO updated successful: ' + this.npo.subject);
                super.unblockui('#m_form_1');
                // this.navigate_list();
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

    clearItem() {
        this.action_npo_item = new NPOItem;
    }

    prepareAddItem() {
        this.clearItem();

        this.action_type = 'add';
        this.action_index = -1;
        this.action_npo_item = new NPOItem;
    }

    prepareEditItem(rowIndex: number) {
        this.clearItem();

        this.action_type = 'edit';
        this.action_index = rowIndex;
        this.action_npo_item = this.npo.trn_payment_n_item[rowIndex];
    }

    prepareRemoveItem(rowIndex: number) {
        this.clearItem();

        this.action_type = 'remove';
        this.action_index = rowIndex;
        this.action_npo_item = this.npo.trn_payment_n_item[rowIndex];
    }

    itemAction() {
        if (this.action_type == "remove") {
            this.removeItem();
        } else if (this.action_type == "edit") {
            this.editItem();
        } else {
            this.addItem();
        }
    }

    addItem() {
        // console.log(this.npo.trn_payment_n_item);
        if (this.npo.trn_payment_n_item == null) {
            this.npo.trn_payment_n_item = new Array<NPOItem>();
        } else {
            /* for (let row of this.npo.trn_payment_n_item) {
                if (row.inv_no == this.inv_no && row.inv_date == this.inv_date && row.acct == this.acct && row.wbs == this.wbs) {
                    super.showError('Duplicate item');
                    return;
                }
            } */
        }
        console.log(this.action_npo_item);
        
        this.action_npo_item.payment_n_id = this.npo.payment_n_id;
        this.action_npo_item.item_status = 'CRT';

        this.npo.trn_payment_n_item.push(this.action_npo_item);

        console.log(this.npo.trn_payment_n_item);
    }

    editItem() {
        console.log(this.npo.trn_payment_n_item);

        this.action_npo_item.item_status = 'CHG';
        this.npo.trn_payment_n_item[this.action_index] = this.action_npo_item;

        console.log(this.npo.trn_payment_n_item);
    }

    removeItem() {
        //item_status='DEL'
        this.npo.trn_payment_n_item[this.action_index].item_status = 'DEL';

        /* let tempNPOItems: Array<NPOItem> = new Array<NPOItem>();
        let index: number = 0;

        if (this.npo.trn_payment_n_item != null && this.npo.trn_payment_n_item.length >= this.action_index) {
            for (let row of this.npo.trn_payment_n_item) {
                if (this.action_index == index) {
                    //do nothing: row that want to remove from array
                } else {
                    // row.route_level = tempNPOItems.length + 1;
                    tempNPOItems.push(row);
                }
                // console.log(row);
                index++;
            }
        }
        // console.log(tempNPOItems);
        this.npo.trn_payment_n_item = tempNPOItems; */
    }

    navigate_list() {
        this._router.navigate(['/trns/npo/list/']);
    }

/*     searchUser(search) {
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
        //this.showDropDownTracking = false;
        this.showDropDownUser = false;
    }
 */
    toggleAdvances_payment() {
        if (this.advances_payment == true) {
            /* this.maxValPlaceholder = "Maximum Value Unlimited"
            this.maxValCaption = "";
            this.npo.maximum_value = null; */
        } else {
            /* this.maxValPlaceholder = "Enter Maximum Value"
            this.maxValCaption = "*"; */
        }

    }


}