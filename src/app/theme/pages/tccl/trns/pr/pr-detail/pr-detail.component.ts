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
    C_DOC_STATUS_REJECTED_NAME
} from '../../../../../../app-constants';
import { PR } from '../../../_models/trns/pr';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { PRService } from './../../../_services/trns/pr.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';

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
    private urlattachment: String = API_ATTACHMENT_GET;
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

    ngOnInit() {
        super.blockui('#m_form_1');
       
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._prService.get<any>(this.id).subscribe(data => {
                this.pr = data;
                this.wf_stage_resp_id = this.pr.worklist.current_responsible.wf_stage_resp_id;
                // console.log(this.pr);
            });
        } else {
            //console.log(this.pr);
        }

        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-pr-detail',
            ['assets/tccl/trns/pr/pr-detail.js']);
    }

    addFile() {
        super.blockui('#m_form_1');

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
                super.unblockui('#m_form_1');
                console.log('error');
            },
            () => {
                super.unblockui('#m_form_1');
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
                super.unblockui('#m_form_1');
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
        super.blockui('#m_form_1');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_REVIEWED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        alert(workflowaction.outcome_description);

        this._workflowService.review<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.showsuccess('Review complete');
                    this.navigate_detail(this.id);
                } else {
                    console.log(resp);
                    super.showError(resp.error_msg);
                    super.unblockui('#m_form_1');
                }
            },
            error => {  
                super.showError(error);
                console.log(error);
                super.unblockui('#m_form_1');
            },
            () => {
                super.unblockui('#m_form_1');
            }
        );
    }
    
    approve() {
        super.blockui('#m_form_1');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_APPROVED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        // alert(workflowaction.outcome_description);

        this._workflowService.approve<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.showsuccess('Approve complete');
                    this.navigate_detail(this.id);
                } else {
                    console.log(resp);
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
            }
        );
    }
    
    reject() {
        super.blockui('#m_form_1');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.pr.workflow_id;
        workflowaction.wf_stage_resp_id = this.wf_stage_resp_id;
        workflowaction.actor_user = super.getADUserLogin();
        workflowaction.actor_username = super.getFullNameUserLogin();
        workflowaction.outcome = C_DOC_STATUS_REJECTED_NAME;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        // alert(workflowaction.outcome_description);

        this._workflowService.reject<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.showsuccess('Reject complete');
                    this.navigate_detail(this.id);
                } else {
                    console.log(resp);
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
            }
        );
    }

    navigate_detail(prId) {
        this._router.navigate(['/trns/pr/detail/'+prId]);
    }

}