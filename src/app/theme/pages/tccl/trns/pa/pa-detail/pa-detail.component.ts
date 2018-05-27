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
    CATEGORY_NAME
} from '../../../../../../app-constants';
import { PA } from '../../../_models/trns/pa';
import { PAItem } from '../../../_models/trns/paitem';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { PAService } from '../../../_services/trns/pa.service';
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

@Component({
    selector: "trns-pa-detail",
    templateUrl: "./pa-detail.component.html",
    styleUrls: ["./pa-detail.component.css"]
})
export class PADetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public pa: PA;
    public fakepa: PA = new PA;
    public id: any;
    public wf_stage_resp_id: any;
    public canReview: boolean = false;
    public canApprove: boolean = false;
    public canComment: boolean = false;
    public canReassignApprover: boolean = false; //***** weeraya 23/05/2018
    public isAssigningNewApprover: boolean = false; //***** weeraya 23/05/2018
    public isWaiting: boolean = false;
    public isDelegate: boolean = false;
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

    constructor(
        private _script: ScriptLoaderService,
        private _router: Router,
        private route: ActivatedRoute,
        private _paService: PAService,
        private _attachmentService: AttachmentService,
        private _workflowService: WorkflowService,
        private _adUserService: ADUserService,
        private formBuilder: FormBuilder) {
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
            this._paService.get<any>(this.id).subscribe(resp => {
                // console.log(resp);

                if (resp.is_error) {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    this.fakepa = null;

                    super.unblockui('#m-content');

                } else {
                    this.pa = resp.data;
console.log(this.pa);
                    if (this.pa.worklist != null && this.pa.worklist.current_responsible != null) {
                        this.wf_stage_resp_id = this.pa.worklist.current_responsible.wf_stage_resp_id;

                        if (this.pa.worklist.current_responsible.resp_allow_action != null && this.pa.worklist.current_responsible.resp_allow_action.toLowerCase() == 'review') {
                            this.canReview = true;
                            this.canReassignApprover = true;
                        }

                        if (this.pa.worklist.current_responsible.resp_allow_action != null && this.pa.worklist.current_responsible.resp_allow_action.toLowerCase() == 'comment') {
                            this.canComment = true;
                        }

                        if (this.pa.worklist.current_responsible.resp_allow_action == null || this.pa.worklist.current_responsible.resp_allow_action == '') {
                            this.canApprove = true;
                        }
console.log(this.canReview + ', ' + this.canApprove + ', ' + this.canComment + ', ' + this.canReassignApprover);
                        //***** weeraya 23/05/2018
                        //If this.canReassignApprover is already TRUE then skip this block
                        /* if (!this.canReassignApprover && true) {
                            this.canReassignApprover = true;
                        } */
                        if (true) {
                            this.canReassignApprover = true;
                        }

                        //Set the flag to display feature reassign approver in html page
                        if (this.canReassignApprover = true) {
                            console.log('asdfffgg');
                            let index = 0;
                            for (let row of this.pa.worklist.stage_list) {
                                if (row.stage_name.toLowerCase() == 'reviewer') {
                                    this.pa.worklist.stage_list[index].canReassignAdd = true;
                                    this.pa.worklist.stage_list[index].canReassignDelete = false;
                                } else {
                                    this.pa.worklist.stage_list[index].canReassignAdd = true;
                                    this.pa.worklist.stage_list[index].canReassignDelete = true;
                                }
                                index++;
                            }
                        }
                    }
                    if (this.pa.pa_attachment_items != null && this.pa.pa_attachment_items.length > 0) {
                        let index = 0;
                        for (let row of this.pa.pa_attachment_items) {
                            // console.log(row);
                            let s = row.file_name.split('.');

                            if (s.length > 0) {
                                this.pa.pa_attachment_items[index].file_extension = s[s.length - 1].toLowerCase().toString();
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

    }

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-pa-detail',
            ['assets/tccl/trns/pa/pa-detail.js']);
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
            this.formData.append("doc_group", ROUTE_PA.doc_group);
            this.formData.append("doc_id", this.pa.payment_id.toString());
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
                this.pa.pa_attachment_items = this.pa.pa_attachment_items || [];

                for (let index = 0; index < att.length; index++) {
                    let s = att[index].file_name.split('.');

                    if (s.length > 0) {
                        att[index].file_extension = s[s.length - 1].toLowerCase().toString();
                    }
                    this.pa.pa_attachment_items.push(att[index]);
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
            this.pa.pa_attachment_items.forEach((item, index) => {
                if (item.attach_id === this.action_attach_file_id) this.pa.pa_attachment_items.splice(index, 1);
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

        this._workflowService.reassign<any>(this.pa.payment_id, this.pa.worklist).subscribe(
            resp => {
                let wf: Workflow  = resp;

                if (resp.is_error == false) {
                    // console.log(resp);
                    super.unblockui('#m-content');
                    super.showsuccess('Re-Assign completed');
                    this.cancelReassign();
                } else {
                    // console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m-content');
                    this.cancelReassign();
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

    prepareRemoveApprover(in_reassign_index, in_reassign_name) {
        this.action_reassign_name = in_reassign_name;
        this.action_reassign_index = in_reassign_index;
    }

    removeApprover() {
        this.pa.worklist.stage_list.splice(this.action_reassign_index,1);
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
        sl.workflow_id = this.pa.worklist.workflow_id;
        sl.actor_user = this.txtApproverUserSelected;
        sl.actor_username = this.txtApproverUserNameSelected;
        sl.destination_user = sl.actor_user;
        sl.destination_username = sl.actor_username;
        sl.stage_logs_list = new Array<WorkflowStageLog>();
        sl.outcome = '';
        sl.outcome_description = '';
        sl.canReassignAdd = true;
        sl.canReassignDelete = true;

        this.pa.worklist.stage_list.splice(this.action_reassign_index + 1,0,sl);
        console.log(this.pa.worklist.stage_list);
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
        workflowaction.workflow_id = this.pa.workflow_id;
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

        if (this.pa.worklist.stage_list[index].stage_logs_list.length > 1) {
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
            return paitem.costcenter + ' / ' + StringUtil.lefttrim(paitem.account_no,'0') + '-' + paitem.account_name ;
        }
    }

    //***** weeraya 23/05/2018 */
    toggleReAssignApprover() {
        this.isAssigningNewApprover = !this.isAssigningNewApprover;
    }

}