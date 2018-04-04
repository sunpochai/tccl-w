import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
    ATTACHMENT_DOC_GROUP_PO,
    API_ATTACHMENT_GET_DEL,
    ROUTE_PO,
    C_DOC_STATUS_2,
    ACTION_NAME,
    CATEGORY_CODE,
    CATEGORY_NAME
} from '../../../../../../app-constants';
import { PO } from '../../../_models/trns/po';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { POService } from './../../../_services/trns/po.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';
import { concat } from 'rxjs/observable/concat';
import { RequestOptions } from '@angular/http';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { PRService } from '../../../_services/trns/pr.service';
import { PRItem } from '../../../_models/trns/pritem';

@Component({
    selector: "trns-po-detail",
    templateUrl: "./po-detail.component.html",
    styleUrls: ["./po-detail.component.css"]
})
export class PODetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public po: PO;
    public fakepo: PO = new PO;
    public id: any;
    public wf_stage_resp_id: any;
    public canReview: boolean = false;
    public canApprove: boolean = false;
    public canComment: boolean = false;
    public isWaiting: boolean = false;
    public isDelegate: boolean = false;
    public urlattachment: String = API_ATTACHMENT_GET_DEL;
    public statusName: any = ACTION_NAME;
    public docStatus: Array<any> = C_DOC_STATUS_2;
    public currentItem: any;
    public categoryCode: any = CATEGORY_CODE;
    public categoryName: any = CATEGORY_NAME;
    public totalVat: number = 0;
    public totalAmount: number = 0;
    public totalDiscount: number = 0;
    public attFile :any ;
    public formData: FormData = new FormData(); 
    public fileList: FileList;
    public action_attach_file_id: any;
    public action_file_name: any;
    public action_type: any;
    public action_comment: any;

    public userList : any;
    public textSearchTrackCode:string;
    public textSearchUser:string;
    public txtAdUserSelected;
    public txtAdUserNameSelected;
    public txtSearchUserChanged:Subject<string> = new Subject<string>();
    public showDropDownUser = false;
    public user_list: any = [];

    public dtSwitch: boolean[] = [];
    
    constructor(
        private _script: ScriptLoaderService,
        private _router: Router,
        private route: ActivatedRoute,
        private _poService: POService,
        private _prService: PRService,
        private _attachmentService: AttachmentService,
        private _workflowService: WorkflowService,
        private _adUserService:ADUserService,
        private formBuilder: FormBuilder) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md=>{
            this.textSearchUser  = md;
            this.searchUser(md);
        })
    }

    loadData() {
        super.blockui('#m-content');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._poService.get<any>(this.id).subscribe(resp => {
                console.log(resp);

                if (resp.is_error) {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    this.fakepo = null;
                    
                    super.unblockui('#m-content');

                } else {
                    this.po = resp.data;
                    
                    if (this.po.worklist != null && this.po.worklist.current_responsible != null) {
                        this.wf_stage_resp_id = this.po.worklist.current_responsible.wf_stage_resp_id;

                        if (this.po.worklist.current_responsible.resp_allow_action != null && this.po.worklist.current_responsible.resp_allow_action.toLowerCase() == 'review') {
                            this.canReview = true;
                            // console.log(this.canReview);
                        }

                        if (this.po.worklist.current_responsible.resp_allow_action != null && this.po.worklist.current_responsible.resp_allow_action.toLowerCase() == 'comment') {
                            this.canComment = true;
                        }

                        if (this.po.worklist.current_responsible.resp_allow_action == null || this.po.worklist.current_responsible.resp_allow_action == '') {
                            this.canApprove = true;
                        }
                    }
                    if (this.po.po_attachment_items != null && this.po.po_attachment_items.length > 0) {
                        let index = 0;
                        for (let row of this.po.po_attachment_items) {
                            // console.log(row);
                            let s = row.file_name.split('.');

                            if (s.length > 0) {
                                this.po.po_attachment_items[index].file_extension = s[s.length-1].toLowerCase().toString();
                            }

                            index++;
                        }
                        // console.log(this.po.po_attachment_items);
                    }

                    for (let item of this.po.po_items) {
                    // console.log(this.po);
                        this.totalVat += item.vat;
                        this.totalAmount += item.total_amount;
                        this.totalDiscount += item.discount;
                    }

                    super.unblockui('#m-content');
                    // console.log(this.po);

                }

                
            },
            error => {
                super.showError(error);
                console.log('error');
                super.unblockui('#m-content');

            },
            () => {
                super.unblockui('#m-content');
                // console.log('done');
            });

        } else {
            //console.log(this.pr);
        }

    }

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-po-detail',
            ['assets/tccl/trns/po/po-detail.js']);
    }

    fileChange(event) {
        //ebugger;  
        this.fileList = event.target.files;  
        // console.log(this.fileList);

        if (this.fileList.length > 0) { 
            this.attFile = []; 
            
            for (let index = 0; index < this.fileList.length; index++) {
                let file = this.fileList[index];
                this.attFile.push(file.name);
            }
            // console.log(this.attFile);
        } else {
            this.attFile = null;
        }
    }

    uploadFile() {
        super.blockui('#m-content');

        if (this.fileList.length > 0) { 
            this.formData.append("doc_group",ROUTE_PO.doc_group);   
            this.formData.append("doc_id",this.po.po_id.toString());  
            this.formData.append("create_user",this.getADUserLogin());  
            this.formData.append("create_username",this.getFullNameUserLogin());
            
            for (let index = 0; index < this.fileList.length; index++) {
                let file = this.fileList[index];
                this.formData.append("file_" + index.toString(), file, file.name); 
            }
            // console.log(this.attFile);
        } else {
            // this.attFile = null;
        }

        this._attachmentService.upload(this.formData).subscribe(  
            data => {
                let att  = data;
                // console.log(att);  
                this.attFile = null;
                this.formData = new FormData();
                super.unblockui('#m-content');
                super.showsuccess('upload complete');
                this.po.po_attachment_items = this.po.po_attachment_items || [] ;

                for (let index = 0; index < att.length; index++) {
                    let s = att[index].file_name.split('.');

                    if (s.length > 0) {
                        att[index].file_extension = s[s.length-1].toLowerCase().toString();
                    }
                    this.po.po_attachment_items.push(att[index]);
                }
                // console.log(this.po.po_attachment_items);
            },  
            error => {
                super.unblockui('#m-content');
                super.showError(error);
            }
        );
    }

    prepareRemoveFile(attachId, fileName) {
        this.action_attach_file_id = attachId;
        this.action_file_name = fileName;
    }
    
    removeFile() {
        // alert(attachId + ',' + fileIndex);
        super.blockui('#m-content');

        this._attachmentService.del(this.action_attach_file_id).subscribe(resp => {
            super.unblockui('#m-content');
            super.showsuccess('Remove file complete');
            //todo:: refresh file list
            this.po.po_attachment_items.forEach( (item, index) => {
                if(item.attach_id === this.action_attach_file_id) this.po.po_attachment_items.splice(index,1);
            });  
        },
        error => {
            super.showError(error);
            console.log('error');
            super.unblockui('#m-content');  
        },
        () => {
            super.unblockui('#m-content');
            // console.log('done');
        });
        super.unblockui('#m-content');
    }

    openFile(fileId) {
        window.open(API_ATTACHMENT_GET_DEL + '/' + fileId);
    }

    prepareAction(action) {
        this.action_type = action;
        this.action_comment = $('#txtComment').val().toString();
    }

    review(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.reviewed;
        workflowaction.outcome_description = this.action_comment;

        console.log(workflowaction);

        this._workflowService.review<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Review completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                console.log(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    approve(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.approved;
        workflowaction.outcome_description = this.action_comment;

        // console.log(workflowaction);

        this._workflowService.approve<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.unblockui('#m-content');
                    super.showsuccess('Approve completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    reject(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.rejected
        workflowaction.outcome_description = this.action_comment;

        this._workflowService.reject<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Reject completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    waiting(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.waiting;
        workflowaction.outcome_description = this.action_comment;

        workflowaction.user_list = [];
        for (let user of this.user_list) {
            workflowaction.user_list.push(user);
        }

        console.log(workflowaction);

        this._workflowService.waiting<any>(workflowaction).subscribe(
            resp => {
                // console.log(resp);
                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Update waiting completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                console.log(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    delegate(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.delegated;
        workflowaction.outcome_description = this.action_comment;

        workflowaction.user_list = [];
        for (let user of this.user_list) {
            workflowaction.user_list.push(user);
        }

        console.log(workflowaction);

        this._workflowService.delegate<any>(workflowaction).subscribe(
            resp => {
                // console.log(resp);
                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Update delegate completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                console.log(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    comment(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.commented;
        workflowaction.outcome_description = this.action_comment;

        console.log(workflowaction);

        this._workflowService.comment<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Comment completed');
                    this.navigate_home();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                console.log(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    performAction() {
        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.po.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();

        switch (this.action_type.toLowerCase().toString()) {
            case 'review':
                this.review(workflowaction);
                break;
            case 'approve':
                this.approve(workflowaction);
                break;
            case 'reject':
                this.reject(workflowaction);
                break;
            case 'waiting':
                this.waiting(workflowaction);
                break;
            case 'delegate':
                this.delegate(workflowaction);
                break;
            case 'comment':
                this.comment(workflowaction);
                break;
        }
    }

    navigate_list() {
        this._router.navigate(['/trns/po/list']);
    }

    navigate_home() {
        this._router.navigate(['/trns/worklist/my']);
    }

    searchUser(search) {
        if(search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownUser = true;
        this._adUserService.search(search).subscribe(x=>  {
            this.userList = x
            // console.log(x);
        });  
    }

    onChangeSearchUser(event){
        // console.log(event);
        this.txtSearchUserChanged.next(event);
    }

    selectUserValue(value) {
        this.textSearchUser = value.fullname;
        this.txtAdUserSelected = value.ad_user;
        this.txtAdUserNameSelected = value.fullname;

        var user = {ad_user: value.ad_user,
                    ad_username: value.fullname} ;
        this.user_list.push(user);

        this.showDropDownUser = false;
        this.textSearchUser = '';
    }

    removeUser(index: number) {
        this.user_list.splice(index,1);
    }
    
    closeDropDown() {
        // console.log('closedropdown');
        this.showDropDownUser = false;
    }

    getTemplateClass(pBlock): string {
        if (pBlock == 'action') {
            return 'col-lg-6 col-sm-12';
        } else if (pBlock == 'attachment') {
            if (this.canReview || this.canApprove || this.canComment) {
                return 'col-lg-6 col-sm-12';
            } else {
                return 'col-12';
            }
        }
        return 'col-12';
    }

    getStatusDisplayClass(pStatus: string): string {
        switch (pStatus.toLowerCase()) {
            case ACTION_NAME.pending.toLowerCase(): 
                return 'm-badge m-badge--warning m-badge--wide';
            case ACTION_NAME.reviewed.toLowerCase(): 
                return 'm-badge m-badge--info m-badge--wide';
            case ACTION_NAME.approved.toLowerCase(): 
                return 'm-badge m-badge--success m-badge--wide';
            case ACTION_NAME.rejected.toLowerCase(): 
                return 'm-badge m-badge--danger m-badge--wide';
            default:
                return 'm-badge-border m-badge--info m-badge--wide';
        }

    }

    getDisplayTR(pDescription): string {
        if (pDescription==null || pDescription=='') {
            return 'table-display-lastrow';
        } else {
            return '';/* no display class */
        }
    }

    getDisplayTRHead(pDescription,pStageLogsList): string {
        if (pStageLogsList!=null && pStageLogsList.length > 1) {
            return this.getDisplayTR('') + ' m--font-boldest';
        } else {
            return this.getDisplayTR(pDescription) + ' m--font-boldest';
        }
    }

    toggleSwitch(index: number) {
        this.dtSwitch[index] = !this.dtSwitch[index];
    }

    toggleAll(pToggle) {
        for (let index in this.dtSwitch) {
            this.dtSwitch[index] = pToggle;
        }
    }

    setInitial(index: number) {
        if (this.dtSwitch == null || typeof this.dtSwitch[index] === 'undefined') {
            this.dtSwitch[index] = false;
        }
    }

    isToggleOn(index: number): boolean {
        this.setInitial(index);
        return this.dtSwitch[index];
    }

    getDisplayIcon(index: number): string {
        this.setInitial(index);

        if (this.po.worklist.stage_list[index].stage_logs_list.length > 1) {
            return this.dtSwitch[index] ? 'fa fa-minus' : 'fa fa-plus' ;
        } else {
            return '' ;
        }
    }

    showDetail(pItem) {
        super.blockui('#m_modal_item_detail');

        this.currentItem = pItem;

        this._prService.getPRItem<any>(this.currentItem.pr_no, this.currentItem.pr_item_no).subscribe(resp => {

            if (resp.is_error) {
                console.log(resp);
                super.showError(resp.error_msg);
                super.unblockui('#m_modal_item_detail');
            } else {
                this.currentItem.pr_item = resp.data;

                // console.log(this.currentItem);

                /* Just to test the display data result and layout  
                    Need to be removed!!!
                */
                if (this.currentItem.pr_item == null) {
                    // this.currentItem.pr_item = this.getFakePRItem();
                }
                // console.log(this.currentItem);

                super.unblockui('#m_modal_item_detail');
            }
        },
        error => {
            super.showError(error);
            console.log(error);
            super.unblockui('#m_modal_item_detail');

        },
        () => {
            super.unblockui('#m_modal_item_detail');
            // console.log('done');
        });

    }

    getFakePRItem() {
        var pritem : PRItem = new PRItem;
        pritem.budget_check = "B";
        pritem.account_no = "0121999000";
        pritem.account_name = "Fixed Assets Dummy";
        pritem.currency = "THB";
        pritem.budget_amount = 297900;
        pritem.budget_commit = 149895;
        pritem.budget_actual = 110240;
        pritem.budget_remaining = 37765;
        
        return pritem;
    }

    formatSAPItemNo(in_sap_no) {
        var out_sap_no = in_sap_no.substr(0,in_sap_no.length-1)
        out_sap_no = this.lefttrim (out_sap_no, '0');
        return out_sap_no;
    }

    lefttrim(s,c) {
        var index = s.indexOf('0');
        
        while (index == 0) {
            // console.log(index);
            s = s.substr(1,s.length-1);
            // console.log(s);
            index = s.indexOf('0');
            if (index!=0) {
                break;
            }
        }
        return s;
    }

}