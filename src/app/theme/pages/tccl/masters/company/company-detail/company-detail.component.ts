import { PageBaseComponent } from './../../../pagebase.component';
import { CompanyService } from './../../_services/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../_models/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../_models/company';
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
    private form: FormGroup;
    private company: Company;
    private id: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _companyService: CompanyService, private formBuilder: FormBuilder) {
        super();
    }
    ngOnInit() {

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        if (this.id != null && this.id != '0') {
            this._companyService.get<Company>(this.id).subscribe(data => {
                this.company = data;
                console.log(this.company);
            });

        } else {
            this.company = new Company();
            // console.log(this.company);
        }

    }
    ngAfterViewInit() {



        this._script.loadScripts('master-company-detail',
            ['assets/tccl/masters/company/company-detail.js']);


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
                super.showError(error);
                super.unblockui('#m_form_1');
                console.log('error');
            },
            () => {
                super.unblockui('#m_form_1');
                console.log('done');
            });


    }
    save() {
        console.log(this.company);
        if (this.id != null && this.id != '0') {
            this.update();
        } else {
            this.create();
        }

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
                console.log('error');
            },
            () => {
                super.unblockui('#m_form_1');
                console.log('done');
            });


    }

    navigate_list() {
        this._router.navigate(['/masters/company/list']);
    }

}