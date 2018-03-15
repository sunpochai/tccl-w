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
    public canReview: boolean = false;
    public canApprove: boolean = false;
    public canComment: boolean = false;
    public urlattachment: String = API_ATTACHMENT_GET_DEL;
    public statusName: any = ACTION_NAME;
    public docStatus: Array<any> = C_DOC_STATUS_2;
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

    loadData() {
        super.blockui('#m-content');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._poService.get<any>(this.id).subscribe(data => {
                this.po = data;
                if (this.po.worklist != null && this.po.worklist.current_responsible != null) {
                    this.wf_stage_resp_id = this.po.worklist.current_responsible.wf_stage_resp_id;

                    if (this.po.worklist.current_responsible.resp_allow_action != null && this.po.worklist.current_responsible.resp_allow_action.toLowerCase() == 'review') {
                        this.canReview = true;
                        // console.log(this.canReview);
                    }

                    if (this.po.worklist.current_responsible.resp_allow_action != null && this.po.worklist.current_responsible.resp_allow_action.toLowerCase() == 'comment') {
                        this.canComment = true;
                    }

                    if (this.po.worklist.current_responsible.resp_allow_action == null) {
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
                    this.totalVat += item.vat;
                    this.totalAmount += item.total_amount;
                    this.totalDiscount += item.discount;
                }

                super.unblockui('#m-content');
                // console.log(this.po);
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
        workflowaction.outcome_description = $('#txtComment').val().toString();

        this._workflowService.review<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Review completed');
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

    approve(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.approved;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        // console.log(workflowaction);

        this._workflowService.approve<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    super.showsuccess('Approve completed');
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

    reject(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.rejected
        workflowaction.outcome_description = $('#txtComment').val().toString();

        this._workflowService.reject<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Reject completed');
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

    waiting(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.waiting;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        //todo:: add aduser list to workflowaction
        //******** */
        workflowaction.user_list = null; 
        //******** */

        // console.log(workflowaction);

        this._workflowService.comment<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Update waiting completed');
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

    comment(workflowaction) {
        super.blockui('#m-content');

        workflowaction.outcome = ACTION_NAME.comment;
        workflowaction.outcome_description = $('#txtComment').val().toString();

        // console.log(workflowaction);

        this._workflowService.comment<any>(workflowaction).subscribe(
            resp => {
                workflowaction = resp;
                if (resp.is_error == false) {
                    console.log(resp);
                    super.showsuccess('Comment completed');
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
            case 'comment':
                this.comment(workflowaction);
                break;
        }
    }

    navigate_list() {
        this._router.navigate(['/trns/po/list']);
    }

}