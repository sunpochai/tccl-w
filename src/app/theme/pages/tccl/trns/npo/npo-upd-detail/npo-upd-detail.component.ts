import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SortPipe } from '../../../../../../_pipe/sort';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { API_USER_LIST, C_DOC_STATUS_REVIEWED } from '../../../../../../app-constants';
import { forEach } from '@angular/router/src/utils/collection';
import { Tracking } from '../../../_models/masters/tracking';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { NPO } from '../../../_models/trns/npo';
import { NPOItem } from '../../../_models/trns/npoitem';
import { NPOService } from '../../../_services/trns/npo.service';
import { DateUtil } from '../../../../../../Util/dateutil';


declare var BootstrapDatepicker: any;

@Component({
    selector: "trns-npo-upd-detail",
    templateUrl: "./npo-upd-detail.component.html",
    styleUrls: ["./npo-upd-detail.component.css"]

})

export class NPOUpdDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public stateForm: FormGroup;
    public npo: NPO;
    public id: any;
    public action_name: string;
    public trackingNumberList: Array<Tracking>;

    public doc_date: string;
    public txt_inv_date: string;

    public advances_payment: boolean;
    // public showDetail: boolean = false;

    public action_npo_item: NPOItem = new NPOItem;
    public action_type: any;
    public action_index: number;

    public sortBy = 'tracking_code';
    public sortType = -1;

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _npoService: NPOService,
        private formBuilder: FormBuilder,
        private _trackingService: TrackingService,
        private _adUserService: ADUserService) {
        super();
    }


    ngOnInit() {
        super.blockui('#m_form_1');

        this._trackingService.getnpoall().subscribe(resp => {
            this.trackingNumberList = resp;
        });

        this.route.params.subscribe(params => {
            //id:any ('0' <-- add new record ,id <-- get old record)
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {

            this.action_name = 'Update';
            this._npoService.get<any>(this.id).subscribe(resp => {

                if (resp.is_error) {
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                } else {
                    this.npo = resp.data;
                    console.log(this.npo);
                    this.doc_date = DateUtil.toDisplayDate(this.npo.doc_date);
                    super.unblockui('#m_form_1');
                }
            });
        } else {
            this.action_name = 'Create';
            this.npo = new NPO();
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
                    BootstrapDatepicker.init();
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

        // this.npo.doc_date = DateUtil.toInternalDate(this.doc_date);

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
                this.doc_date = DateUtil.toDisplayDate(this.npo.doc_date);
                super.showsuccess('Non-PO created successful: ' + this.npo.doc_no);
                super.unblockui('#m_form_1');
                this.navigate_upd(this.npo.payment_n_id);
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

        console.log(this.npo);

        this._npoService.save<any>(this.npo).subscribe(resp => {
            console.log(resp);
            if (resp.is_error == false) {
                this.npo = resp.data;
                super.showsuccess('Non-PO updated successful: ' + this.npo.doc_no);
                super.unblockui('#m_form_1');
                this.navigate_upd(this.npo.payment_n_id);
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

    send() {
        super.blockui('#m_form_1');

        this.fillData(false);

        this._npoService.sendApprove<any>(this.npo).subscribe(resp => {
            console.log(resp);
            if (resp.is_error == false) {
                this.npo = resp.data;
                super.showsuccess('Send approve successful: ' + this.npo.doc_no);
                super.unblockui('#m_form_1');
                this.navigate_detail();
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
        this.txt_inv_date = '';
    }

    prepareAddItem() {
        this.clearItem();

        this.action_type = 'add';
        this.action_index = -1;
        this.action_npo_item = new NPOItem;

        // this.showDetail = true;
    }

    prepareEditItem(rowIndex: number) {
        this.clearItem();

        this.action_type = 'edit';
        this.action_index = rowIndex;
        
        this.action_npo_item = Object.assign({}, this.npo.trn_payment_n_item[rowIndex]);
        this.txt_inv_date = DateUtil.toDisplayDate(this.action_npo_item.inv_date);
    }

    prepareRemoveItem(rowIndex: number) {
        this.clearItem();

        this.action_type = 'remove';
        this.action_index = rowIndex;
        this.action_npo_item = this.npo.trn_payment_n_item[rowIndex];
    }

    itemAction() {
        console.log('itemaction')
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
        // console.log(this.txt_inv_date);
        
        this.action_npo_item.payment_n_id = this.npo.payment_n_id;
        this.action_npo_item.item_status = 'CRT';
        this.action_npo_item.inv_date = DateUtil.toInternalDate(this.txt_inv_date);

        this.npo.trn_payment_n_item.push(this.action_npo_item);

        this.updateGrandTotal();

        // console.log(this.npo.trn_payment_n_item);
    }

    editItem() {
        // console.log(this.npo.trn_payment_n_item);

        // console.log(this.action_npo_item);
        this.action_npo_item.item_status = 'CHG';
        this.action_npo_item.inv_date = DateUtil.toInternalDate(this.txt_inv_date);

        this.npo.trn_payment_n_item[this.action_index] = this.action_npo_item;
        // console.log(this.npo.trn_payment_n_item);

        this.updateGrandTotal();
        // this.showDetail = false;

        // console.log(this.npo.trn_payment_n_item);
    }

    removeItem() {
        //item_status='DEL'
        this.npo.trn_payment_n_item[this.action_index].item_status = 'DEL';
        this.updateGrandTotal();

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

    updateGrandTotal() {
        this.npo.grand_total = 0;
        for (let row of this.npo.trn_payment_n_item) {
            if (row.item_status!='DEL') {
                this.npo.grand_total = this.npo.grand_total + row.amount;
            }
        }
    }

    navigate_list() {
        this._router.navigate(['/trns/npo/list/']);
    }

    navigate_detail() {
        this._router.navigate(['/trns/npo/detail/' + this.npo.payment_n_id]);
    }

    navigate_back() {
        console.log(this.npo.payment_n_id);
        if (this.npo.payment_n_id != 0 && this.npo.payment_n_id != null) {
            console.log(this.npo.payment_n_id);
            this.navigate_detail();
        } else {
            this.navigate_list();
        }
    }

    navigate_upd(in_npo_id) {
        this._router.navigate(['/trns/npo/update/' + in_npo_id]);
    }

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

    toDisplayDate(in_string) {
        return DateUtil.toDisplayDate(in_string);
    }

    getSaveItemStatus() {
        // console.log('getSaveItemStatus')
        if (this.action_npo_item.inv_no==null||this.action_npo_item.inv_no==''||
            this.action_npo_item.inv_desc==null||this.action_npo_item.inv_desc==''||
            this.txt_inv_date==null||this.txt_inv_date==''||
            this.action_npo_item.amount==null||this.action_npo_item.amount<=0
        ) {
            return 'True';
        } else {
            return 'False';
        }
        // return this.action_npo_item.inv_no==null || this.action_npo_item.inv_desc==null || this.action_npo_item.amount==null || this.inv_date == null;
    }
 
    onChangeStartDate(event) {
        console.log(event);
    }
   

}