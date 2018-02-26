import { PageBaseComponent } from './../../../pagebase.component';
import { PMService } from './../../../_services/trns/pm.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PM } from '../../../_models/trns/pm';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { Attachment } from '../../../_models/trns/attachment';
import { ATTACHMENT_DOC_GROUP_PM } from '../../../../../../app-constants';




@Component({
    selector: "trn-pm-detail",
    templateUrl: "./pm-detail.component.html"/*,
    styleUrls: ["./pm-detail.component.css"]*/
})
export class PMDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private form: FormGroup;
    private pm: PM;
    private id: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _pmService: PMService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');
       
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._pmService.get<PM>(this.id).subscribe(data => {
                this.pm = data;
                console.log(this.pm);
            });

        } else {
            this.pm = new PM();
            // console.log(this.pm);
        }

        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trn-pm-detail',
            ['assets/tccl/trn/doctype/pm-detail.js']);
    }

    // create() {
    //     super.blockui('#m_form_1');
    //     this.pm.create_user = super.getADUserLogin();
    //     this.pm.create_username = super.getFullNameUserLogin();
    //     this.pm.create_datetime = new Date();
    //     this._pmService.create<PM>(this.pm).subscribe(resp => {
    //         this.pm = resp;
    //         super.showsuccess(this.doctype.doc_type_code + ' create complete');
    //         this._router.navigate(['/masters/doctype/list']);
    //     },
    //     error => {  
    //         alert(error);
    //         super.showError(error);
    //         super.unblockui('#m_form_1');
    //     },
    //     () => {
    //         super.unblockui('#m_form_1');
    //     });
    // }

    createAttachment() {
        super.blockui('#m_form_1');

        let attachment: Attachment;
        attachment.create_user = super.getADUserLogin();
        attachment.create_username = super.getFullNameUserLogin();
        attachment.create_datetime = new Date();

        attachment.doc_group = ATTACHMENT_DOC_GROUP_PM;
        // attachment.doc_ref_id;
        // attachment.file_name;
        // attachment.file_content;

        this._pmService.put<PM>(this.pm).subscribe(
            resp => {
                this.pm = resp;
                super.showsuccess(this.pm.matdoc_no + '/' + this.pm.doc_year + ' update complete');
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
        console.log(this.pm);
        if (this.id != null && this.id != '0') {
            this.review();
        } else {
            this.review();//this.approve();
        }
    }

    review() {
        super.blockui('#m_form_1');
        // this.pm.update_user = super.getADUserLogin();
        // this.pm.update_username = super.getFullNameUserLogin();
        // this.pm.update_datetime = new Date();
        this._pmService.put<PM>(this.pm).subscribe(
            resp => {
                this.pm = resp;
                super.showsuccess(this.pm.matdoc_no + '/' + this.pm.doc_year + ' update complete');
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
        this._router.navigate(['/trn/pm/list']);
    }

}