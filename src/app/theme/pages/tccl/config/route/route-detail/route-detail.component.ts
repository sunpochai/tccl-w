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
import { ROUTE_PR, ROUTE_PO, ROUTE_PA, API_USER_LIST, API_TRACKING_GET_PUT_DEL } from '../../../../../../app-constants';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { RouteApproveDetail } from '../../../_models/config/routeapprovedetail';
import { forEach } from '@angular/router/src/utils/collection';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';


 

@Component({ 
    selector: "config-route-detail",
    templateUrl: "./route-detail.component.html",
    styleUrls: ["./route-detail.component.css"]

})

export class RouteApproveDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private stateForm: FormGroup;
    private routeapprove: RouteApprove;
    private id: any;
    private routetype: any;
    private doctypeList: Array<DocType>;
    private priceoverpr_yes: boolean;
    private priceoverpr_no: boolean;
    private trackingList : any;
    private userList : any;
    private textSearchTrackCode:string;
    private textSearchUser:string;

    private action_type: any;
    private action_item: any;
    private action_index: any;

    private txtSearchTrackingChanged:Subject<string> = new Subject<string>();
    private txtAdUserSelected;
    private txtAdUserNameSelected;

    private txtSearchUserChanged:Subject<string> = new Subject<string>();
    
    
    showDropDown = false;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _routeapproveService: RouteApproveService,
        private _doctypeService: DocTypeService,
        private formBuilder: FormBuilder,
        private _trackingService:TrackingService,
        private _adUserService:ADUserService) {
        super();
       
        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md=>{
                this.textSearchUser  = md;
                this.searchUser(md);
        })

        this.txtSearchTrackingChanged.debounceTime(500).distinctUntilChanged().subscribe(md=>{
            this.textSearchTrackCode  = md;
            this.searchTracking(md);
    })
    }

   
    ngOnInit() {
        super.blockui('#m_form_1');

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        this.route.params.subscribe(params => {
            //id:any ('pr','po','pa' <-- add new record ,id <-- get old record)

            if (params['id'] + '' == ROUTE_PR.name) {
                this.routetype = ROUTE_PR;
            } else if (params['id'] + '' == ROUTE_PO.name) {
                this.routetype = ROUTE_PO;
            } else if (params['id'] + '' == ROUTE_PA.name) {
                this.routetype = ROUTE_PA;
            } else {
                this.id = params['id'];
            }
        });

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
                }

                this.priceoverpr_yes = (this.routeapprove.price_over_pr_flag == 'A' || this.routeapprove.price_over_pr_flag == 'Y');
                this.priceoverpr_no = (this.routeapprove.price_over_pr_flag == 'A' || this.routeapprove.price_over_pr_flag == 'N');
                this.textSearchTrackCode = this.routeapprove.tracking_no;
                console.log(this.routeapprove);
                // console.log(this.routetype);
            });
        } else {
            this.routeapprove = new RouteApprove();
            // console.log(this.routeapprove);
        }
        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-detail',
            ['assets/tccl/config/route/route-detail.js']);
 
            }

    save() {
        // console.log(this.routeapprove);
        if (this.routeapprove.route_id != null && this.routeapprove.route_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    create() {
        super.blockui('#m_form_1');

        this.routeapprove.doc_group = this.routetype.doc_group;
        if (this.routetype.doc_group == ROUTE_PR.doc_group) {
            this.routeapprove.minimum_value = 0;
            this.routeapprove.maximum_value = 999999999999;
        } else {
            this.routeapprove.account = 'A';
        }

        if (this.priceoverpr_yes && this.priceoverpr_no) {
            this.routeapprove.price_over_pr_flag = 'A';
        } else if (this.priceoverpr_yes) {
            this.routeapprove.price_over_pr_flag = 'Y';
        } else if (this.priceoverpr_no) {
            this.routeapprove.price_over_pr_flag = 'N';
        } else {
            //default
            this.routeapprove.price_over_pr_flag = 'A';
        }

        this.routeapprove.route_status = true;
        this.routeapprove.create_user = super.getADUserLogin();
        this.routeapprove.create_username = super.getFullNameUserLogin();
        this.routeapprove.create_datetime = new Date();
        console.log( $('#m_select2_6').val('') );
        console.log(this.routeapprove.tracking_no);
        console.log(this.routeapprove);
        this._routeapproveService.create<any>(this.routeapprove).subscribe(resp => {
            console.log(resp);
            this.routeapprove = resp;
            super.showsuccess(this.routeapprove.route_name + ' create complete');
            super.unblockui('#m_form_1');
            // this.navigate_list();
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

        // console.log(this.routeapprove.doc_type);
        if (this.priceoverpr_yes && this.priceoverpr_no) {
            this.routeapprove.price_over_pr_flag = 'A';
        } else if (this.priceoverpr_yes) {
            this.routeapprove.price_over_pr_flag = 'Y';
        } else if (this.priceoverpr_no) {
            this.routeapprove.price_over_pr_flag = 'N';
        } else {
            //default
            this.routeapprove.price_over_pr_flag = 'A';
        }

        this.routeapprove.update_user = super.getADUserLogin();
        this.routeapprove.update_username = super.getFullNameUserLogin();
        this.routeapprove.update_datetime = new Date();
        this._routeapproveService.put<RouteApprove>(this.routeapprove).subscribe(resp => {
            this.routeapprove = resp;
            super.showsuccess(this.routeapprove.route_name + ' update complete');
            // this.navigate_list();
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
        console.log('prepareadd');
        this.action_type = 'add';
        this.action_item = '';
        this.action_index = '';
        this.textSearchUser = '';
        // $('#m_select_approver').val('');
        // $('#m_approver_action').val('');
        // $('#m_approver_action_row_index').val('');
    }

    prepareEditApprover(rowIndex: number) {
        console.log(rowIndex);
        console.log('prepareedit');
        this.action_type = 'edit';
        console.log(this.routeapprove.cf_route_detail);
        this.action_item = this.routeapprove.cf_route_detail[rowIndex].ad_user;
        this.action_index = rowIndex;
        // $('#m_select_approver').val(this.routeapprove.cf_route_detail[rowIndex].ad_user);
        // $('#m_approver_action').val('edit');
        // $('#m_approver_action_row_index').val(rowIndex);
    }

    approverAction() {
        console.log('approveraction');

        if (this.action_type == "edit") {
            this.editApprover(parseInt(this.action_index));
            console.log(parseInt(this.action_index));
            console.log('edit approver');
        } else {
            this.addApprover();
            console.log('add approver');
        }
        // if ($('#m_approver_action').val().toString() == "edit") {
        //     this.editApprover(parseInt($('#m_approver_action_row_index').val().toString()));
        //     console.log(parseInt($('#m_approver_action_row_index').val().toString()));
        //     console.log('edit approver');
        // } else {
        //     this.addApprover();
        //     console.log('add approver');
        // }
    }

    addApprover() {
        super.blockui('#m-content');

        if (this.routeapprove.cf_route_detail == null) {
            this.routeapprove.cf_route_detail = new Array<RouteApproveDetail>();
        } else {

            for (let row of this.routeapprove.cf_route_detail) {
                if (row.ad_user == this.action_item)  {
                // console.log(row); // 1, "string", false
                    super.showError('Duplicate approver name');
                    super.blockui('#m-content');
                    return;
                }
            }
        }

        let approver: RouteApproveDetail = new RouteApproveDetail;
        approver.route_id = this.routeapprove.route_id;
        approver.route_d_id = null;
        
        approver.route_level = this.routeapprove.cf_route_detail.length + 1;
       // approver.ad_user = $('#m_select_approver').val().toString();
       // approver.ad_username = $("#m_select_approver :selected").text();
        approver.ad_user = this.txtAdUserSelected;
        approver.ad_username = this.txtAdUserNameSelected;
     
        approver.create_user = super.getADUserLogin();
        approver.create_username = super.getFullNameUserLogin();
        approver.create_datetime = new Date();

        // console.log(approver);
        this.routeapprove.cf_route_detail.push(approver);

        super.blockui('#m-content');
    }

    editApprover(rowIndex: number) {
        super.blockui('#m-content');

        this.routeapprove.cf_route_detail[rowIndex].ad_user = this.txtAdUserSelected;
        this.routeapprove.cf_route_detail[rowIndex].ad_username = this.txtAdUserNameSelected;
     
       // this.routeapprove.cf_route_detail[rowIndex].ad_user = $('#m_select_approver').val().toString();//'tcc\\sanchaip';
       // this.routeapprove.cf_route_detail[rowIndex].ad_username = $("#m_select_approver :selected").text();
        this.routeapprove.cf_route_detail[rowIndex].create_user = super.getADUserLogin();
        this.routeapprove.cf_route_detail[rowIndex].create_username = super.getFullNameUserLogin();
        this.routeapprove.cf_route_detail[rowIndex].create_datetime = new Date();

        super.unblockui('#m-content');  
    }

    removeApprover(rowIndex: number) {
        super.blockui('#m-content');

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
        this.routeapprove.cf_route_detail = tempApprovers;
    }

    navigate_list() {
        this._router.navigate(['/config/route/list/' + this.routetype.name]);
    }


    
    searchTracking(search) {
        if(search.length < 2) return;
        console.log("search >>" + search);
         this.showDropDown = true;
         this._trackingService.search(this.textSearchTrackCode).subscribe(x=>  {
         this.trackingList = x
       });  
    }
   
    searchUser(search) {
        if(search.length < 2) return;
        console.log("search >>" + search);
        this.showDropDown = true;
        this._adUserService.search(search).subscribe(x=>  {
         this.userList = x
       });  
    }

    onChangeSearchTracking(event){
          console.log(event);
          this.txtSearchTrackingChanged.next(event);
    }
    onChangeSearchUser(event){
          console.log(event);
          this.txtSearchUserChanged.next(event);
    }

    selectTrackingValue(value) {
        this.textSearchTrackCode = value.tracking_code 
        this.routeapprove.tracking_no = value.tracking_code;
        
        this.showDropDown = false;
    }
      
    selectUserValue(value) {
        this.textSearchUser = value.fullname 
        this.txtAdUserSelected = value.ad_user;
        this.txtAdUserNameSelected = value.fullname;
        this.showDropDown = false;
    }
    
      closeDropDown() {
        this.showDropDown = false;
      }
    

}