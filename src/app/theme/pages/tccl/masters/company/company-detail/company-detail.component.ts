import { PageBaseComponent } from './../../../pagebase.component';
import { CompanyService } from './../../../_services/masters/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../../_models/masters/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../_models/masters/company';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';




@Component({
    selector: "master-company-detail",
    templateUrl: "./company-detail.component.html",
    styleUrls: ["./company-detail.component.css"]
})
export class CompanyDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public company: Company;
    public id: any;
    public action_type: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _companyService: CompanyService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._companyService.get<Company>(this.id).subscribe(data => {
                this.company = data;
                this.action_type = 'update';
                super.unblockui('#m_form_1');
                // console.log(this.company);
            });
        } else {
            this.company = new Company();
            this.action_type = 'add';
            super.unblockui('#m_form_1');
            // console.log(this.company);
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-company-detail',
            ['assets/tccl/masters/company/company-detail.js']);
    }

    save() {
        // console.log(this.company);
        if (this.id != null && this.id != '0') {
            this.update();
        } else {
            this.create();
        }
    }

    create() {
        super.blockui('#m_form_1');
        this.company.create_user = super.getADUserLogin();
        this.company.create_username = super.getFullNameUserLogin();
        this.company.create_datetime = new Date();
        this._companyService.create<Company>(this.company).subscribe(resp => {
            this.company = resp;
            super.showsuccess(this.company.comp_code + ' create complete');
            this._router.navigate(['/masters/company/list']);
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

    update() {
        super.blockui('#m_form_1');
        this.company.update_user = super.getADUserLogin();
        this.company.update_username = super.getFullNameUserLogin();
        this.company.update_datetime = new Date();
        this._companyService.put<Company>(this.company).subscribe(resp => {
            this.company = resp;
            super.showsuccess(this.company.comp_code + ' update complete');
            this._router.navigate(['/masters/company/list']);
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
        this._router.navigate(['/masters/company/list']);
    }

}