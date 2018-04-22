import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
    ATTACHMENT_DOC_GROUP_PR,
    API_ATTACHMENT_GET_DEL,
    ROUTE_PR,
    C_DOC_STATUS_2,
    ACTION_NAME
} from '../../../../../../app-constants';
import { PR } from '../../../_models/trns/pr';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { PRService } from './../../../_services/trns/pr.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';
import { concat } from 'rxjs/observable/concat';
import { RequestOptions } from '@angular/http';
import { ADUser } from '../../../_models/masters/aduser';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { StringUtil } from '../../../../../../Util/stringutil';

@Component({
    selector: "trns-pr-detail",
    templateUrl: "./pr-detail.component.html",
    styleUrls: ["./pr-detail.component.css"]
})
export class PRDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public pr: PR;
    public fakepr: PR = new PR;
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
    public showDropDownUser = false;
    public user_list: any = [];

    public dtSwitch: boolean[] = [];

    constructor(
        private _script: ScriptLoaderService,
        private _router: Router,
        private route: ActivatedRoute,
        private _prService: PRService,
        private _attachmentService: AttachmentService,
        private _workflowService: WorkflowService,
        private _adUserService: ADUserService,
        private formBuilder: FormBuilder) {
        super();

        this.txtSearchUserChanged.debounceTime(500).distinctUntilChanged().subscribe(md => {
            this.textSearchUser = md;
            this.searchUser(md);
        })

    }

    loadData() {
        super.blockui('#m-content');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._prService.get<any>(this.id).subscribe(resp => {
                // console.log(resp);

                if (resp.is_error) {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    this.fakepr = null;

                    super.unblockui('#m-content');

                } else {

                    this.pr = resp.data;

                    if (this.pr.worklist != null && this.pr.worklist.current_responsible != null) {
                        this.wf_stage_resp_id = this.pr.worklist.current_responsible.wf_stage_resp_id;

                        if (this.pr.worklist.current_responsible.resp_allow_action != null && this.pr.worklist.current_responsible.resp_allow_action.toLowerCase() == 'review') {
                            this.canReview = true;
                        }

                        if (this.pr.worklist.current_responsible.resp_allow_action != null && this.pr.worklist.current_responsible.resp_allow_action.toLowerCase() == 'comment') {
                            this.canComment = true;
                        }

                        if (this.pr.worklist.current_responsible.resp_allow_action == null || this.pr.worklist.current_responsible.resp_allow_action == '') {
                            this.canApprove = true;
                        }
                        // console.log(this.pr.worklist.current_responsible);
                    }
                    if (this.pr.pr_attachment_items != null && this.pr.pr_attachment_items.length > 0) {
                        let index = 0;
                        for (let row of this.pr.pr_attachment_items) {
                            // console.log(row);
                            let s = row.file_name.split('.');

                            if (s.length > 0) {
                                this.pr.pr_attachment_items[index].file_extension = s[s.length - 1].toLowerCase().toString();
                            }

                            index++;
                        }
                        // console.log(this.pr.pr_attachment_items);
                    }

                    super.unblockui('#m-content');
                    // console.log(this.pr.worklist);
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

        // console.log(UtilService.formatSAPItemNo('00020'));
    }

    ngOnInit() {
        super.blockui('#m-content');
        this.loadData();
        super.unblockui('#m-content');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-pr-detail',
            ['assets/tccl/trns/pr/pr-detail.js']);
    }

    fileChange(event) {
        super.blockui('#m-content');

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

                    super.unblockui('#m-content');
                    return;
                }

                this.attFile.push(file.name);

                if (index == this.fileList.length - 1) {
                    super.unblockui('#m-content');
                }
            }
            // console.log(this.attFile);
        } else {
            this.attFile = null;
            super.unblockui('#m-content');
        }
    }

    uploadFile() {
        super.blockui('#m-content');

        if (this.fileList.length > 0) {
            this.formData.append("doc_group", ROUTE_PR.doc_group);
            this.formData.append("doc_id", this.pr.pr_id.toString());
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
                this.pr.pr_attachment_items = this.pr.pr_attachment_items || [];

                for (let index = 0; index < att.length; index++) {
                    let s = att[index].file_name.split('.');

                    if (s.length > 0) {
                        att[index].file_extension = s[s.length - 1].toLowerCase().toString();
                    }
                    this.pr.pr_attachment_items.push(att[index]);
                }
                // console.log(this.pr.pr_attachment_items);
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
            this.pr.pr_attachment_items.forEach((item, index) => {
                if (item.attach_id === this.action_attach_file_id) this.pr.pr_attachment_items.splice(index, 1);
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
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        // console.log(super.getADUserLogin());
        workflowaction.actor_username = super.getFullNameUserLogin();
        // console.log(super.getFullNameUserLogin());

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
        this._router.navigate(['/trns/pr/list']);
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
            //  console.log(x);
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
        // console.log(pDescription);
        // console.log(pStageLogsList);
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

        if (this.pr.worklist.stage_list[index].stage_logs_list.length > 1) {
            return this.dtSwitch[index] ? 'fa fa-minus' : 'fa fa-plus';
        } else {
            return '';
        }
    }

    showDetail(pItem) {
        this.currentItem = pItem;
    }

    formatSAPItemNo(in_sap_item_no) {
        return StringUtil.formatSAPItemNo(in_sap_item_no);
    }

    lefttrim(s,c) {
        return StringUtil.lefttrim(s,c);
    }

    getAttachFileWidthClass() {
        if (this.canApprove || this.canComment || this.canReview) {
            return "col-12";
        } else {
            return "col-6";
        }
    }

}