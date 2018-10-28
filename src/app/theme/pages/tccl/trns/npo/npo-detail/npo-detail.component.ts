import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
    ATTACHMENT_DOC_GROUP_PA,
    API_ATTACHMENT_GET_DEL,
    ROUTE_PA,
    C_DOC_STATUS_2,
    ACTION_NAME,
    CATEGORY_CODE,
    CATEGORY_NAME,
    ROUTE_NPO
} from '../../../../../../app-constants';
import { NPO } from '../../../_models/trns/npo';
import { NPOItem } from '../../../_models/trns/npoitem';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { NPOService } from '../../../_services/trns/npo.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';
import { concat } from 'rxjs/observable/concat';
import { RequestOptions } from '@angular/http';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { StringUtil } from '../../../../../../Util/stringutil';
import { DateUtil } from '../../../../../../Util/dateutil';
import { Workflow } from '../../../_models/trns/workflow';
import { WorkflowStage } from '../../../_models/trns/workflowstage';
import { WorkflowStageLog } from '../../../_models/trns/workflowstagelog';
import { WindowRef } from '../../../../../../_services/WindowRef';
// import { Injectable } from '@angular/core';
 
@Component({
    selector: "trns-npo-detail",
    templateUrl: "./npo-detail.component.html",
    styleUrls: ["./npo-detail.component.css"]
})

export class NPODetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public npo: NPO;
    public fakenpo: NPO = new NPO;
    public id: any;
    public wf_stage_resp_id: any;
    public canReview: boolean = false;
    public canApprove: boolean = false;
    public canComment: boolean = false;
    public canReassignApprover: boolean = false;

    public isWaiting: boolean = false;
    public isDelegate: boolean = false;
    public isAssigningNewApprover: boolean = false;

    public urlattachment: String = API_ATTACHMENT_GET_DEL;
    public statusName: any = ACTION_NAME;
    public docStatus: Array<any> = C_DOC_STATUS_2;
    public currentItem: any;
    public categoryCode: any = CATEGORY_CODE;
    public categoryName: any = CATEGORY_NAME;

    public action_reassign_index: number;
    public action_reassign_name: String;
    
    public attFile: any;
    public formData: FormData = new FormData();
    public fileList: FileList;
    public action_attach_file_id: any;
    public action_file_name: any;
    public action_type: any;
    public action_comment: any;

    public userList: any;
    public textSearchTrackCode: string;
    public textSearchUser: string;
    public txtAdUserSelected;
    public txtAdUserNameSelected;
    public txtSearchUserChanged: Subject<string> = new Subject<string>();
    public showDropDownUser: boolean = false;
    public user_list: any = [];
    
    public showDropDownApprover: boolean = false;
    public approverList: any;
    public textSearchApprover: string;
    public txtSearchApproverChanged: Subject<string> = new Subject<string>();
    public txtApproverUserSelected: string;
    public txtApproverUserNameSelected: string;

    public dtSwitch: boolean[] = [];
    public showPurchasingHistory: boolean = false;

    public myUtil = new StringUtil;

    /** 05/10/2018 */
    public printDatetime: Date;
    public printMsg: String;
     
    constructor(
        private _script: ScriptLoaderService,
        private _router: Router,
        private route: ActivatedRoute,
        private _npoService: NPOService,
        private _attachmentService: AttachmentService,
        private _workflowService: WorkflowService,
        private _adUserService: ADUserService,
        private formBuilder: FormBuilder,
        private winRef: WindowRef) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchUser = md;
            this.searchUser(md);
        })

        this.txtSearchApproverChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchApprover = md;
            this.searchApprover(md);
        })    
    }

    loadData() {
        super.blockui('#m-content');

        if (this.id==null || this.id=='0') {
            this.route.params.subscribe(params => {
                this.id = params['id'];
            });
        }

        if (this.id != null && this.id != '0') {
            this._npoService.get<any>(this.id).subscribe(resp => {
                // console.log(resp);

                if (resp.is_error) {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    this.fakenpo = null;

                    super.unblockui('#m-content');

                } else {
                    this.npo = resp.data;
// console.log(this.pa);
                    if (this.npo.worklist != null && this.npo.worklist.current_responsible != null) {
                        this.wf_stage_resp_id = this.npo.worklist.current_responsible.wf_stage_resp_id;

                        if (this.npo.worklist.current_responsible.resp_allow_action != null && this.npo.worklist.current_responsible.resp_allow_action.toLowerCase() == 'review') {
                            this.canReview = true;
                            this.canReassignApprover = true;
                        }

                        if (this.npo.worklist.current_responsible.resp_allow_action != null && this.npo.worklist.current_responsible.resp_allow_action.toLowerCase() == 'comment') {
                            this.canComment = true;
                        }

                        if (this.npo.worklist.current_responsible.resp_allow_action == null || this.npo.worklist.current_responsible.resp_allow_action == '') {
                            this.canApprove = true;
                        }
// console.log(this.canReview + ', ' + this.canApprove + ', ' + this.canComment + ', ' + this.canReassignApprover);
                        //***** weeraya 23/05/2018
                        //If this.canReassignApprover is already TRUE then skip this block
                        if (!this.canReassignApprover && true) {
                            this.canReassignApprover = true;
                        }

                        //Set the flag to display feature reassign approver in html page
                        if (this.canReassignApprover == true) {
                            // console.log('asdfffgg');
                            let index = 0;
                            let firstadd: boolean = false;
                            for (let row of this.npo.worklist.stage_list) {
                                if (row.stage_name.toLowerCase() == 'reviewer') {
                                    if (index == this.npo.worklist.stage_list.length - 1) {
                                        // cannot add another approver after last reviewer 
                                        this.npo.worklist.stage_list[index].canReassignAdd = false;
                                    } else {
                                        // only first reviewer can follow by approver
                                        if (firstadd) {
                                            this.npo.worklist.stage_list[index].canReassignAdd = false;
                                        } else {
                                            this.npo.worklist.stage_list[index].canReassignAdd = true;
                                            firstadd = true;
                                        }
                                    }
                                    this.npo.worklist.stage_list[index].canReassignDelete = false;
                                } else {
                                    this.npo.worklist.stage_list[index].canReassignAdd = true;
                                    this.npo.worklist.stage_list[index].canReassignDelete = true;
                                }
                                index++;
                            }
                        }
                    }
                    if (this.npo.pa_attachment_items != null && this.npo.pa_attachment_items.length > 0) {
                        let index = 0;
                        for (let row of this.npo.pa_attachment_items) {
                            // console.log(row);
                            let s = row.file_name.split('.');

                            if (s.length > 0) {
                                this.npo.pa_attachment_items[index].file_extension = s[s.length - 1].toLowerCase().toString();
                            }

                            index++;
                        }
                        // console.log(this.po.po_attachment_items);
                    }

                    super.unblockui('#m-content');
                    // console.log(this.po);
                }
            },
                error => {
                    super.showError(error);
                    // console.log('error');
                    super.unblockui('#m-content');
                },
                () => {
                    super.unblockui('#m-content');
                    // console.log('done');
                });
        } else {
            //console.log(this.pr);
        }

        let mydate = new Date();
        let dd = new Date(mydate.getFullYear(), mydate.getMonth(), mydate.getDate())
        this.printDatetime = dd;
    }

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        /* this._script.loadScripts('trns-npo-detail',
            ['assets/tccl/trns/npo/npo-detail.js']); */
    }

    fileChange(event) {
        //ebugger;  
        this.fileList = event.target.files;
        // console.log(this.fileList);

        if (this.fileList.length > 0) {
            this.attFile = [];

            for (let index = 0; index < this.fileList.length; index++) {
                let file = this.fileList[index];

                var sFileName = file.name;
                var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
                var iFileSize = file.size;
                // var iConvert = (file.size / 1048576).toFixed(2);

                if ( !( sFileExtension === "pdf"
                     || sFileExtension === "doc" 
                     || sFileExtension === "docx" 
                     || sFileExtension === "xls" 
                     || sFileExtension === "xlsx" )
                     || iFileSize > (1048576*50) ) {
                    
                    super.showError("Wrong file format (only .pdf, .doc, .docx, .xls, .xlsx allowed) or file size larger than 50MB!");
                    this.attFile = null;
                    this.fileList = null;
                    return;
                }

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
            this.formData.append("doc_group", ROUTE_NPO.doc_group);
            this.formData.append("doc_id", this.npo.payment_n_id.toString());
            this.formData.append("create_user", this.getADUserLogin());
            this.formData.append("create_username", this.getFullNameUserLogin());

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
                let att = data;
                // console.log(att);  
                this.attFile = null;
                this.formData = new FormData();
                super.unblockui('#m-content');
                super.showsuccess('upload complete');
                this.npo.pa_attachment_items = this.npo.pa_attachment_items || [];

                for (let index = 0; index < att.length; index++) {
                    let s = att[index].file_name.split('.');

                    if (s.length > 0) {
                        att[index].file_extension = s[s.length - 1].toLowerCase().toString();
                    }
                    this.npo.pa_attachment_items.push(att[index]);
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
            this.npo.pa_attachment_items.forEach((item, index) => {
                if (item.attach_id === this.action_attach_file_id) this.npo.pa_attachment_items.splice(index, 1);
            });
        },
            error => {
                super.showError(error);
                // console.log('error');
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

        // console.log(workflowaction);

        this._workflowService.review<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    // console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Review completed');
                    this.navigate_home();
                } else {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                // console.log(error);
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
                    // console.log(resp);
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

        // console.log(workflowaction);

        this._workflowService.waiting<any>(workflowaction).subscribe(
            resp => {
                // console.log(resp);
                if (resp.is_error == false) {
                    // console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Update waiting completed');
                    this.navigate_home();
                } else {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                // console.log(error);
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

        // console.log(workflowaction);

        this._workflowService.delegate<any>(workflowaction).subscribe(
            resp => {
                // console.log(resp);
                if (resp.is_error == false) {
                    // console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Update delegate completed');
                    this.navigate_home();
                } else {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                // console.log(error);
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

        // console.log(workflowaction);

        this._workflowService.comment<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    // console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Comment completed');
                    this.navigate_home();
                } else {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                }
            },
            error => {
                super.showError(error);
                // console.log(error);
                super.unblockui('#m-content');
            },
            () => {
                super.unblockui('#m-content');
            }
        );
    }

    reassignApprover() {
        super.blockui('#m-content');
        console.log(this.npo.payment_n_id);
        console.log(this.npo.worklist);

        this._workflowService.reassignNpo<any>(this.npo.payment_n_id, this.npo.worklist).subscribe(
            resp => {
                let wf: Workflow  = resp;

                if (resp.is_error == false) {
                    console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Re-Assign completed');
                    this.cancelReassign();
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                    this.cancelReassign();
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

    prepareRemoveApprover(in_reassign_index, in_reassign_name) {
        this.action_reassign_name = in_reassign_name;
        this.action_reassign_index = in_reassign_index;
    }

    removeApprover() {
        this.npo.worklist.stage_list.splice(this.action_reassign_index,1);
    }

    prepareAddApprover(in_reassign_index) {
        this.action_reassign_index = in_reassign_index;

        this.textSearchApprover = '';
        this.txtApproverUserSelected = '';
        this.txtApproverUserNameSelected = '';
    }

    addApprover() {
        // this.pa.worklist.stage_list.splice(this.action_reassign_index,1);
        let sl: WorkflowStage = new WorkflowStage;
        sl.workflow_id = this.npo.worklist.workflow_id;
        sl.actor_user = this.txtApproverUserSelected;
        sl.actor_username = this.txtApproverUserNameSelected;
        sl.destination_user = sl.actor_user;
        sl.destination_username = sl.actor_username;
        sl.stage_name = 'Approver';
        sl.stage_logs_list = new Array<WorkflowStageLog>();
        sl.outcome = '?';
        sl.canReassignAdd = true;
        sl.canReassignDelete = true;

        this.npo.worklist.stage_list.splice(this.action_reassign_index + 1,0,sl);
        console.log(this.npo.worklist.stage_list);
    }

    cancelReassign() {
        this.isAssigningNewApprover = false;
        this.loadData();
    }

    searchApprover(search) {
        if (search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownApprover = true;
        this._adUserService.search(search).subscribe(x => {
            this.approverList = x
            // console.log(x);
        });
    }

    onChangeSearchApprover(event) {
        // console.log(event);
        this.txtSearchApproverChanged.next(event);
    }

    selectApprover(value) {
        this.textSearchApprover = value.fullname;
        this.txtApproverUserSelected = value.ad_user;
        this.txtApproverUserNameSelected = value.fullname;

        var user = {            
            ad_user: value.ad_user,
            ad_username: value.fullname
        };

        this.showDropDownApprover = false;
        // this.textSearchApprover = '';
    }

    closeDropDownApprover() {
        this.showDropDownApprover = false;
    }

    performAction() {
        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.npo.workflow_id;
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
            case 're-assign':
                this.reassignApprover();
                break;
        }
    }

    navigate_list() {
        this._router.navigate(['/trns/pa/list']);
    }

    navigate_home() {
        this._router.navigate(['/trns/worklist/my']);
    }

    searchUser(search) {
        if (search.length < 2) return;
        // console.log("search >>" + search);
        this.showDropDownUser = true;
        this._adUserService.search(search).subscribe(x => {
            this.userList = x
            // console.log(x);
        });
    }

    onChangeSearchUser(event) {
        // console.log(event);
        this.txtSearchUserChanged.next(event);
    }

    selectUserValue(value) {
        this.textSearchUser = value.fullname;
        this.txtAdUserSelected = value.ad_user;
        this.txtAdUserNameSelected = value.fullname;

        var user = {            
            ad_user: value.ad_user,
            ad_username: value.fullname
        };
        this.user_list.push(user);

        this.showDropDownUser = false;
        this.textSearchUser = '';
    }

    removeUser(index: number) {
        this.user_list.splice(index, 1);
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
                return 'm-badge m-badge--warning m-badge--fullwidth';
            case ACTION_NAME.reviewed.toLowerCase():
                return 'm-badge m-badge--info m-badge--fullwidth';
            case ACTION_NAME.approved.toLowerCase():
                return 'm-badge m-badge--success m-badge--fullwidth';
            case ACTION_NAME.rejected.toLowerCase():
            case ACTION_NAME.canceled.toLowerCase():
                return 'm-badge m-badge--danger m-badge--fullwidth';
            case ACTION_NAME.waiting.toLowerCase():
            case ACTION_NAME.commented.toLowerCase():
            case ACTION_NAME.delegated.toLowerCase():
                return 'm-badge-border m-badge--info m-badge--fullwidth';
            default:
                return 'm-badge-border m-badge--info m-badge--wide';
        }
    }

    getDisplayTR(pDescription): string {
        if (pDescription == null || pDescription == '') {
            return 'table-display-lastrow';
        } else {
            return '';/* no display class */
        }
    }

    getDisplayTRHead(pDescription, pStageLogsList): string {
        if (pStageLogsList != null && pStageLogsList.length > 1) {
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

        if (this.npo.worklist.stage_list[index].stage_logs_list.length > 1) {
            return this.dtSwitch[index] ? 'fa fa-minus' : 'fa fa-plus';
        } else {
            return '';
        }
    }

    formatSAPItemNo(in_sap_item_no) {
        return StringUtil.formatSAPItemNo(in_sap_item_no);
    }

    lefttrim(s, c) {
        return StringUtil.lefttrim(s, c);
    }

    toDisplayDateString(s: string) {
        return DateUtil.toDisplayDateString(s);
    }

    getAttachFileWidthClass() {
        if (this.canApprove || this.canComment || this.canReview) {
            return "col-12";
        } else {
            return "col-6";
        }
    }

    getAccountAssignmentDesc(paitem: any) {
        //WBS -> Order number -> Cost center + GL Account
        if (paitem.wbs_no != null && paitem.wbs_no != '') {
            return paitem.wbs_no + '-' + paitem.wbs_name ;
        } else if (paitem.order_no != null && paitem.order_no != '') {
            return paitem.order_no ;
        } else {
            var tmp = paitem.costcenter + ' / ' + StringUtil.lefttrim(paitem.account_no,'0') + '-' + paitem.account_name ;
            if (tmp == ' / ' + '-')
                return '' ;
            else
                return tmp ;
        }
    }

    //***** weeraya 23/05/2018 */
    toggleReAssignApprover() {
        this.isAssigningNewApprover = !this.isAssigningNewApprover;
    }

    canUpdate() {
        if (this.npo == null) {
            return false;
        }

        return super.getADUserLogin() == this.npo.create_user;
    }

    canPrint() {
        // return true;
        if (this.npo == null) {
            return false;
        }

        return (this.npo.afp_no!=null && this.npo.afp_no!='');
    }
    
    print() {
        super.blockui('#m-content');
        // console.log(this.printMsg);
        this.printMsg="aabb";
        // console.log(this.printMsg);
        this._npoService.print<any>(this.npo,super.getADUserLogin()).subscribe(resp => {
            // console.log(this.printMsg);
            console.log(resp);
            if (resp.is_error == false) {
                this.printDatetime = resp.print_datetime;
                this.printMsg = resp.print_msg;
                // console.log(this.printMsg);
                super.showsuccess('Update status print completed');
                super.unblockui('#m-content');
                 this.printReport();
            } else {
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
            });
    }
    
    printReport(): void {
        // console.log('printreport');
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
          
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        console.log("popupWin " + popupWin);
        popupWin.document.open(); 
        // <link rel="stylesheet" href="assets/demo/default/base/style.bundle.css" type="text/css" media="print" />
        popupWin.document.write(`
          <html>
            <head>
              <title>Non PO</title>
              <style @media="print">
                @page {
                    margin: 2cm;
                }

                header nav, footer {
                    display: none;
                    }

                body {
                    font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
                    line-height: 1;
                    min-width: 992px ; }

                .m--font-deleted {
                    color: #f4516c !important ; 
                    text-decoration: line-through; }

                .table {
                    font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
                    border-collapse: collapse; 
                    background-color: #000; }
                .table td,
                .table th {
                    background-color: #fff ; }
                
                .table-bordered {
                    border-collapse: collapse; 
                    border: 1px solid #000000; }
                .table-bordered th,
                .table-bordered td {
                    //font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
                    border: 1px solid #000000; }
                .table-bordered thead th,
                .table-bordered thead td {
                    border-bottom-width: 2px; }

                .table-underline {
                    padding: 0px 0px 0px 5px;
                    border-bottom: solid black;
                    border-bottom-width: 1px; }

                .table-display {
                    width: 100%;
                    max-width: 100%;
                    border: 5px;
                    text-align: left;
                    background-color: transparent; }
                .table-display-caption {
                    //font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
                    color: #888888;
                    padding: 5px;
                    text-align: left;
                    vertical-align: middle; }

                  
              </style>
            </head>
            <body onload="window.print();window.close();">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }

    getDisplayBudgetDate(): string {
        if (this.npo.trn_payment_n_budget == null || this.npo.trn_payment_n_budget.length <= 0)
            return 'n/a';
        
        if (this.npo.trn_payment_n_budget[0].check_date == null)
            return 'n/a';
        else 
            return DateUtil.toDisplayDate(this.npo.trn_payment_n_budget[0].check_date);
    }

}
