import { PageBaseComponent } from './../../../pagebase.component';
import { PRService } from './../../../_services/trns/pr.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PR } from '../../../_models/trns/pr';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { Attachment } from '../../../_models/trns/attachment';
import { ATTACHMENT_DOC_GROUP_PR } from '../../../../../../app-constants';




@Component({
    selector: "trn-pr-detail",
    templateUrl: "./pr-detail.component.html"/*,
    styleUrls: ["./pr-detail.component.css"]*/
})
export class PRDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private form: FormGroup;
    private pr: PR;
    private id: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _prService: PRService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');
       
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._prService.get<PR>(this.id).subscribe(data => {
                this.pr = data;
                console.log(this.pr);
            });

        } else {
            this.pr = new PR();
            // console.log(this.pr);
        }

        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trn-pr-detail',
            ['assets/tccl/trn/doctype/pr-detail.js']);
    }

    createAttachment() {
        super.blockui('#m_form_1');

        let attachment: Attachment;
        attachment.create_user = super.getADUserLogin();
        attachment.create_username = super.getFullNameUserLogin();
        attachment.create_datetime = new Date();

        attachment.doc_group = ATTACHMENT_DOC_GROUP_PR;
        // attachment.doc_ref_id;
        // attachment.file_name;
        // attachment.file_content;

        this._prService.put<PR>(this.pr).subscribe(
            resp => {
                this.pr = resp;
                super.showsuccess(this.pr.pr_no + ' update complete');
                this.navigate_list();
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

    save() {
        console.log(this.pr);
        if (this.id != null && this.id != '0') {
            this.review();
        } else {
            this.review();//this.approve();
        }
    }

    review() {
        super.blockui('#m_form_1');
        // this.pr.update_user = super.getADUserLogin();
        // this.pr.update_username = super.getFullNameUserLogin();
        // this.pr.update_datetime = new Date();
        this._prService.put<PR>(this.pr).subscribe(
            resp => {
                this.pr = resp;
                super.showsuccess(this.pr.pr_no + '/' + ' update complete');
                this.navigate_list();
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

    navigate_list() {
        this._router.navigate(['/trn/pr/list']);
    }

}