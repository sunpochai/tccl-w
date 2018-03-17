import { PageBaseComponent } from './../../../pagebase.component';
import { CompanyService } from './../../../_services/masters/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
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
import { forEach } from '@angular/router/src/utils/collection';
import { Reviewer } from '../../../_models/config/reviewer';
import { ReviewerService } from '../../../_services/config/reviewer.service';

declare var AutoCompleteControl:any;

 

@Component({ 
    selector: "config-reviewer-detail",
    templateUrl: "./reviewer-detail.component.html",
    styleUrls: ["./reviewer-detail.component.css"]

})

export class ReviewerDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private form: FormGroup;
    private reviewer: Reviewer;
    private id: any;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _reviewerService: ReviewerService,
        private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        // this._reviewerService.getall().subscribe(data => {
        //     this.doctypeList = data;
        //     // console.log(data);
        // });

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._reviewerService.get<Reviewer>(this.id).subscribe(data => {
                this.reviewer = data;
                console.log(this.reviewer);
                // console.log(this.routetype);
            });
        } else {
            this.reviewer = new Reviewer();
            // console.log(this.routeapprove);
        }
        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-reviewer-detail',
            ['assets/tccl/config/reviewer/reviewer-detail.js']);

            // jQuery(document).ready(function() {
            //     AutoCompleteControl.load(API_REVIEWER_GET_PUT_DEL);
            // });
    }

    save() {
        // console.log(this.routeapprove);
        if (this.reviewer.review_id != null && this.reviewer.review_id != 0) {
            this.update();
        } else {
            this.create();
        }
    }

    create() {
        super.blockui('#m_form_1');

        this.reviewer.create_user = super.getADUserLogin();
        this.reviewer.create_username = super.getFullNameUserLogin();
        this.reviewer.create_datetime = new Date();
        this.reviewer.update_user = super.getADUserLogin();
        this.reviewer.update_username = super.getFullNameUserLogin();
        this.reviewer.update_datetime = this.reviewer.create_datetime
        
        this._reviewerService.create<any>(this.reviewer).subscribe(resp => {
            console.log(resp);
            this.reviewer = resp;
            super.showsuccess('Review id: ' + this.reviewer.sap_code + ' create complete');
            super.unblockui('#m_form_1');
            // this.navigate_list();
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

        this.reviewer.update_user = super.getADUserLogin();
        this.reviewer.update_username = super.getFullNameUserLogin();
        this.reviewer.update_datetime = new Date();
        this._reviewerService.put<Reviewer>(this.reviewer).subscribe(resp => {
            this.reviewer = resp;
            super.showsuccess('Review id: ' + this.reviewer.sap_code + ' update complete');
            // this.navigate_list();
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
        this._router.navigate(['/config/reviewer/list/']);
    }

    // searchemp(obj) {
         
    //    this._trackingService.search('').subscribe(x=>  {
    //     console.log(x);
    //     this.tackingList =x
    //    });
    // }
}