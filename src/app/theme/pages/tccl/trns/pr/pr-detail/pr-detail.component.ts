import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { 
    ATTACHMENT_DOC_GROUP_PR, 
    API_ATTACHMENT_GET,
    C_DOC_STATUS_REVIEWED_NAME,
    C_DOC_STATUS_APPROVED_NAME,
    C_DOC_STATUS_REJECTED_NAME,
    C_DOC_STATUS_WAIT_REVIEW_NAME,
    C_DOC_STATUS
} from '../../../../../../app-constants';
import { PR } from '../../../_models/trns/pr';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { PRService } from './../../../_services/trns/pr.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';
import { concat } from 'rxjs/observable/concat';

@Component({
    selector: "trns-pr-detail",
    templateUrl: "./pr-detail.component.html",
    styleUrls: ["./pr-detail.component.css"]
})
export class PRDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private form: FormGroup;
    private pr: PR;
    private id: any;
    private wf_stage_resp_id: any;
    private canReview: boolean = false;
    private canApprove: boolean = false;
    private canComment: boolean = false;
    private urlattachment: String = API_ATTACHMENT_GET;
    private statusName: any = {"reviewed":C_DOC_STATUS_REVIEWED_NAME,"approved":C_DOC_STATUS_APPROVED_NAME, "rejected":C_DOC_STATUS_REJECTED_NAME};
    private cDocStatus: Array<Array<any>> = C_DOC_STATUS;
    constructor(
        private _script: ScriptLoaderService,
        private _router: Router, 
        private route: ActivatedRoute,
        private _prService: PRService, 
        private _attachmentService: AttachmentService,
        private _workflowService: WorkflowService,
        private formBuilder: FormBuilder) {
        super();
    }

    loadData() {
        super.blockui('#m-content');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._prService.get<any>(this.id).subscribe(data => {
                this.pr = data;
                if (this.pr.worklist != null && this.pr.worklist.current_responsible != null) {
                    this.wf_stage_resp_id = this.pr.worklist.current_responsible.wf_stage_resp_id;

                    if (this.pr.worklist.current_responsible.resp_allow_action != null && this.pr.worklist.current_responsible.resp_allow_action.toLowerCase()=='review') {
                        this.canReview = true;
                    }

                    if (this.pr.worklist.current_responsible.resp_allow_action != null && this.pr.worklist.current_responsible.resp_allow_action.toLowerCase()=='comment') {
                        this.canComment = true;
                    }

                    if (this.pr.worklist.current_responsible.resp_allow_action==null) {
                        this.canApprove = true;
                    }
                }
                super.unblockui('#m-content');
                console.log(this.pr);
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
        this._script.loadScripts('trns-pr-detail',
            ['assets/tccl/trns/pr/pr-detail.js']);
    }

    addFile() {
        super.blockui('#m-content');

        let attachment: Attachment = new Attachment;
        attachment.create_user = super.getADUserLogin();
        attachment.create_username = super.getFullNameUserLogin();
        attachment.create_datetime = new Date();

        attachment.doc_group = ATTACHMENT_DOC_GROUP_PR;
        attachment.doc_ref_id = this.pr.pr_id;
        // attachment.file_name;
        // attachment.file_content;

        this._attachmentService.insert<Attachment>(attachment).subscribe(
            resp => {
                //todo:: check error message and decide what to do ...KT 06/03/2018 */
                attachment = resp;
                super.showsuccess('Upload file complete');

                //todo:: refresh file list
                this.pr.pr_attachment_items.push(attachment);
            },
            error => {  
                super.showError(error);
                super.unblockui('#m-content');
                console.log('error');
            },
            () => {
                super.unblockui('#m-content');
                // console.log('done');
            }
        );
    }

    removeFile(attachId, fileIndex) {
        // alert(attachId + ',' + fileIndex);
        super.blockui('#m-content');

        this._attachmentService.del(attachId).subscribe(resp => {
            if (resp.is_error == false) {
                super.showsuccess('Remove file complete');

                //todo:: refresh file list
                this.pr.pr_attachment_items.forEach( (item, index) => {
                    if(item.attach_id === attachId) this.pr.pr_attachment_items.splice(index,1);
                });
            } else {
                console.log(resp);
                super.showError(resp.error_msg);
                super.unblockui('#m-content');
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
        super.unblockui('#m-content');
    }

    openFile(fileId) {
        window.open(API_ATTACHMENT_GET + '/' + fileId);
    }
    
    review() {
        super.blockui('#m-content');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_REVIEWED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        this._workflowService.review<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Review complete');
                    window.location.reload();
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
    
    approve() {
        super.blockui('#m-content');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_APPROVED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        this._workflowService.approve<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.showsuccess('Approve complete');
                    window.location.reload();
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
    
    reject() {
        super.blockui('#m-content');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_REJECTED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        this._workflowService.reject<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Reject complete');
                    window.location.reload();
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

    waiting() {
        super.blockui('#m-content');
        super.unblockui('#m-content');
    }

    comment() {
        super.blockui('#m-content');
        super.unblockui('#m-content');
    }

    performAction() {
        var pAction =  $('#input_action').val().toString().toLocaleLowerCase();

        switch (pAction) {
            case 'review':
                // console.log('doaction review');
                this.review();
                break;
            case 'approve':
                // console.log('doaction approve');
                this.approve();
                break;
            case 'reject':
                // console.log('doaction reject');
                this.reject();
                break;
            case 'waiting':
                // console.log('doaction waiting');
                this.waiting();
                break;
            case 'comment':
                // console.log('doaction waiting');
                this.comment();
                break;
        }
    }
    
    navigate_list() {
        this._router.navigate(['/trns/pr/list']);
    }

}