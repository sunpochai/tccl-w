
import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { 
    API_ATTACHMENT_GET_DEL,
    C_DOC_STATUS_REVIEWED_NAME,
    C_DOC_STATUS_APPROVED_NAME,
    C_DOC_STATUS_REJECTED_NAME,
    ATTACHMENT_DOC_GROUP_PO
} from '../../../../../../app-constants';
import { PO } from '../../../_models/trns/po';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { POService } from './../../../_services/trns/po.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';

@Component({
    selector: "trns-po-detail",
    templateUrl: "./po-detail.component.html",
    styleUrls: ["./po-detail.component.css"]
})
export class PODetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public po: PO;
    public id: any;  
    public wf_stage_resp_id: any;
    public urlattachment: String = API_ATTACHMENT_GET_DEL;
    constructor(
        private _script: ScriptLoaderService,
        private _router: Router, 
        private route: ActivatedRoute,
        private _poService: POService, 
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
            this._poService.get<any>(this.id).subscribe(data => {
                this.po = data;
                this.wf_stage_resp_id = this.po.worklist.current_responsible.wf_stage_resp_id;
                // console.log(this.pr);
            });
        } else {
            //console.log(this.pr);
        }

        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-po-detail',
            ['assets/tccl/trns/po/po-detail.js']);
    }
 
    removeFile(attachId, fileIndex) {
        // alert(attachId + ',' + fileIndex);
        super.blockui('#m-content');

        this._attachmentService.del(attachId).subscribe(resp => {
            if (resp.is_error == false) {
                super.showsuccess('Remove file complete');

                //todo:: refresh file list
                this.po.po_attachment_items.forEach( (item, index) => {
                    if(item.attach_id === attachId) this.po.po_attachment_items.splice(index,1);
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
        window.open(API_ATTACHMENT_GET_DEL + '/' + fileId);
    }
    
    review() {
        super.blockui('#m_form_1');

        let workflowaction: WorkflowAction = new WorkflowAction;
        workflowaction.workflow_id = this.po.workflow_id;
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
        workflowaction.workflow_id = this.po.workflow_id;
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
        workflowaction.workflow_id = this.po.workflow_id;
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

    navigate_detail(poId) {
        this._router.navigate(['/trns/po/detail/'+poId]);
    }

}