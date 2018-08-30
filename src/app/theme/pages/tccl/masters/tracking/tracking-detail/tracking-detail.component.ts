import { PageBaseComponent } from './../../../pagebase.component';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../../_models/masters/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { TrackingService } from '../../../_services/masters/tracking.service';

@Component({
    selector: "master-tracking-detail",
    templateUrl: "./tracking-detail.component.html"
})
export class TrackingDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public form: FormGroup;
    public tracking: Tracking;
    public id: any;
    public action_type: any;
    public chk_non_po = false;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _trackingService: TrackingService, private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit() {
        super.blockui('#m_form_1');

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        // console.log(this.id);

        if (this.id != null && this.id != '0') {
            this._trackingService.get<Tracking>(this.id).subscribe(data => {
                this.tracking = data;
                this.action_type = 'update';
                this.chk_non_po = this.tracking.npo_flag;
                console.log(this.tracking);
                super.unblockui('#m_form_1');
            });
        } else {
            this.tracking = new Tracking();
            this.action_type = 'add';
            // console.log(this.doctype);
            super.unblockui('#m_form_1');
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-tracking-detail',
            ['assets/tccl/masters/tracking/tracking-detail.js']);
    }

    create() {
        super.blockui('#m_form_1');
        this.tracking.create_user = super.getADUserLogin();
        this.tracking.create_username = super.getFullNameUserLogin();
        this.tracking.create_datetime = new Date();
        this.tracking.update_user = super.getADUserLogin();
        this.tracking.update_username = super.getFullNameUserLogin();
        this.tracking.update_datetime = this.tracking.create_datetime;
        this.tracking.npo_flag = this.chk_non_po;
        console.log(this.tracking);
        this._trackingService.create<Tracking>(this.tracking).subscribe(resp => {
            this.tracking = resp;
            super.showsuccess(this.tracking.tracking_code + ' create complete');
            this._router.navigate(['/masters/tracking/list']);
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
        // console.log(this.tracking);
        if (this.id != null && this.id != '0') {
            this.update();
        } else {
            this.create();
        }
    }

    update() {
        super.blockui('#m_form_1');
        this.tracking.update_user = super.getADUserLogin();
        this.tracking.update_username = super.getFullNameUserLogin();
        this.tracking.update_datetime = new Date();
        this.tracking.npo_flag = this.chk_non_po;
        console.log(this.tracking);
        this._trackingService.put<Tracking>(this.tracking).subscribe(resp => {
            this.tracking = resp;
            super.showsuccess(this.tracking.tracking_code + ' update complete');
            this._router.navigate(['/masters/tracking/list']);
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
        this._router.navigate(['/masters/tracking/list']);
    }

    toggleNonPO() {
        /* if (this.maxValPlaceholder == "Enter Maximum Value") {
            this.maxValPlaceholder = "Maximum Value Unlimited"
            this.maxValCaption = "";
            this.routeapprove.maximum_value = null;
        } else {
            this.maxValPlaceholder = "Enter Maximum Value"
            this.maxValCaption = "*";
        } */

    }
}