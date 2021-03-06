import { PageBaseComponent } from './../../../pagebase.component';
import { DocTypeService } from './../../../_services/masters/doctype.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../../_models/masters/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import { DocType } from '../../../_models/masters/doctype';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';




@Component({
    selector: "master-doctype-detail",
    templateUrl: "./doctype-detail.component.html"/*,
    styleUrls: ["./doctype-detail.component.css"]*/
})
export class DocTypeDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public doctype: DocType;
    public id: any;
    public action_type: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _docTypeService: DocTypeService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._docTypeService.get<DocType>(this.id).subscribe(data => {
                this.doctype = data;
                this.action_type = 'update';
                console.log(this.doctype);
                super.unblockui('#m_form_1');
            });
        } else {
            this.doctype = new DocType();
            this.action_type = 'add';
            // console.log(this.doctype);
            super.unblockui('#m_form_1');
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-doctype-detail',
            ['assets/tccl/masters/doctype/doctype-detail.js']);
    }

    create() {
        super.blockui('#m_form_1');
        this.doctype.create_user = super.getADUserLogin();
        this.doctype.create_username = super.getFullNameUserLogin();
        this.doctype.create_datetime = new Date();
        this.doctype.update_user = super.getADUserLogin();
        this.doctype.update_username = super.getFullNameUserLogin();
        this.doctype.update_datetime = this.doctype.create_datetime;
        this._docTypeService.create<DocType>(this.doctype).subscribe(resp => {
            this.doctype = resp;
            super.showsuccess(this.doctype.doc_type_code + ' create complete');
            this._router.navigate(['/masters/doctype/list']);
        },
            error => {
                alert(error);
                super.showError(error);
                super.unblockui('#m_form_1');

            },
            () => {
                super.unblockui('#m_form_1');

            });


    }
    save() {

        console.log(this.doctype);
        if (this.id != null && this.id != '0') {
            this.update();
        } else {
            this.create();
        }

    }
    update() {

        super.blockui('#m_form_1');
        this.doctype.update_user = super.getADUserLogin();
        this.doctype.update_username = super.getFullNameUserLogin();
        this.doctype.update_datetime = new Date();
        this._docTypeService.put<DocType>(this.doctype).subscribe(resp => {
            this.doctype = resp;
            super.showsuccess(this.doctype.doc_type_code + ' update complete');
            this._router.navigate(['/masters/doctype/list']);
        },
            error => {
                super.showError(error);
                super.unblockui('#m_form_1');

            },
            () => {
                super.unblockui('#m_form_1');

            });


    }

    navigate_list() {
        this._router.navigate(['/masters/doctype/list']);
    }

}