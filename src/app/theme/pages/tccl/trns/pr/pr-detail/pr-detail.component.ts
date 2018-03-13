import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';  
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { 
    ATTACHMENT_DOC_GROUP_PR, 
    API_ATTACHMENT_GET,
    C_DOC_STATUS_REVIEWED_NAME,
    C_DOC_STATUS_APPROVED_NAME,
    C_DOC_STATUS_REJECTED_NAME,
    C_DOC_STATUS_WAIT_REVIEW_NAME,
    C_DOC_STATUS,
    ROUTE_PR
} from '../../../../../../app-constants';
import { PR } from '../../../_models/trns/pr';
import { Attachment } from '../../../_models/trns/attachment';
import { WorkflowAction } from '../../../_models/trns/workflowaction';
import { PRService } from './../../../_services/trns/pr.service';
import { AttachmentService } from '../../../_services/trns/attachment.service';
import { WorkflowService } from '../../../_services/trns/workflow.service';
import { concat } from 'rxjs/observable/concat';
import { RequestOptions } from '@angular/http';

@Component({
    selector: "trns-pr-detail",
    templateUrl: "./pr-detail.component.html",
    styleUrls: ["./pr-detail.component.css"]
})
export class PRDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public pr: PR;
    public id: any;
    public wf_stage_resp_id: any;
    public canReview: boolean = false;
    public canApprove: boolean = false;
    public canComment: boolean = false;
    public urlattachment: String = API_ATTACHMENT_GET;
    public statusName: any = {"reviewed":C_DOC_STATUS_REVIEWED_NAME,"approved":C_DOC_STATUS_APPROVED_NAME, "rejected":C_DOC_STATUS_REJECTED_NAME};
    public cDocStatus: Array<Array<any>> = C_DOC_STATUS;
    public attFile :any ;
    public formData: FormData = new FormData(); 
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

    
    removeFile(attachId, fileIndex) {
        // alert(attachId + ',' + fileIndex);
        super.blockui('#m-content');

        this._attachmentService.del(attachId).subscribe(resp => {
                super.unblockui('#m-content');
                super.showsuccess('Remove file complete');
                //todo:: refresh file list
                this.pr.pr_attachment_items.forEach( (item, index) => {
                    if(item.attach_id === attachId) this.pr.pr_attachment_items.splice(index,1);
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

   
fileChange(event) {  
    //ebugger;  
 
    let fileList: FileList = event.target.files;  
    if (fileList.length > 0) { 
        this.attFile = []; 
        let headers = new Headers()  
            //headers.append('Content-Type', 'json');  
            //headers.append('Accept', 'application/json');  
            this.formData.append("doc_group",ROUTE_PR.doc_group);   
            this.formData.append("doc_id",this.pr.pr_id.toString());  
            this.formData.append("create_user",this.getADUserLogin());  
            this.formData.append("create_username",this.getFullNameUserLogin());
         
            
        for (let index = 0; index < fileList.length; index++) {
            let file = fileList[index];
            this.formData.append("file_" + index.toString(), file, file.name); 
            this.attFile.push(file.name);
        } 
          
    }else{
        this.attFile = null;
    }
}
uploadFile(){
    super.blockui('#m-content');
    
        this._attachmentService.upload(this.formData).subscribe(  
            data => {
                let att  = data;
                console.log(data);  
                this.attFile = null;
                this.formData = new FormData()  ;
                super.unblockui('#m-content'); 
                super.showsuccess('upload complete');
                this.pr.pr_attachment_items = this.pr.pr_attachment_items || [] ;
                 for (let index = 0; index < att.length; index++) {
                        this.pr.pr_attachment_items.push(att[index]);
                }
                
            },  
            error => {  
                    
                super.unblockui('#m-content');
                super.showError(error);
            }
            );    
        
}
}