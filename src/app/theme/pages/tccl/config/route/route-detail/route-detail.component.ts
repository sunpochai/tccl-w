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
import { RouteApproveService } from '../../../_services/config/routeapprove.service';
import { RouteApprove } from '../../../_models/config/routeapprove';
import { ROUTE_PR, ROUTE_PO, ROUTE_PA } from '../../../../../../app-constants';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';

@Component({
    selector: "config-route-detail",
    templateUrl: "./route-detail.component.html",
    styleUrls: ["./route-detail.component.css"]
})
export class RouteApproveDetailComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    private form: FormGroup;
    private routeapprove: RouteApprove;
    private id: any;
    private routetype: any;
    private doctypeList: Array<DocType>;
    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _routeapproveService: RouteApproveService, 
        private _doctypeService: DocTypeService, 
        private formBuilder: FormBuilder) {
        super();
    }
    ngOnInit() {
        super.blockui('#m_form_1');

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        this.route.params.subscribe(params => {
            //id:any ('pr','po','pa' <-- add new record ,id <-- get old record)

            if (params['id']+'' == ROUTE_PR.name) {
                this.routetype = ROUTE_PR;
            } else if (params['id']+'' == ROUTE_PO.name) {
                this.routetype = ROUTE_PO;
            } else if (params['id']+'' == ROUTE_PA.name) {
                this.routetype = ROUTE_PA;
            } else {
                this.id = params['id'];
            }
        });

        if (this.id != null && this.id != '0') {
            this._routeapproveService.get<RouteApprove>(this.id).subscribe(data => {
                this.routeapprove = data;
                switch (this.routeapprove.doc_group) {
                    case ROUTE_PR.doc_group:
                        this.routetype = ROUTE_PR;
                        break;
                    case ROUTE_PO.doc_group:
                        this.routetype = ROUTE_PO;
                        break;
                    case ROUTE_PA.doc_group:
                        this.routetype = ROUTE_PA;
                        break;
                }
                console.log(this.routeapprove);
                console.log(this.routetype);
            });
        } else {
            this.routeapprove = new RouteApprove();
            // console.log(this.routeapprove);
        }
        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('config-route-detail',
            ['assets/tccl/config/route/route-detail.js']);
    }

    create() {
        // super.blockui('#m_form_1');
        // this.routeapprove.create_user = super.getADUserLogin();
        // this.routeapprove.create_username = super.getFullNameUserLogin();
        // this.routeapprove.create_datetime = new Date();
        // this._routeService.create<Company>(this.routeapprove).subscribe(resp => {
        //     this.company = resp;
        //     super.showsuccess(this.routeapprove.comp_code + ' create complete');
        //     this._router.navigate(['/masters/company/list']);
        // },
        // error => {  
        //     alert(error);
        //     super.showError(error);
        //     super.unblockui('#m_form_1');
        // },
        // () => {
        //     super.unblockui('#m_form_1');
           
        // });
    }

    save() {
        // console.log(this.company);
        // if (this.id != null && this.id != '0') {
        //     this.update();
        // } else {
        //     this.create();
        // }
    }

    update() {
        super.blockui('#m_form_1');
        // this.company.update_user = super.getADUserLogin();
        // this.company.update_username = super.getFullNameUserLogin();
        // this.company.update_datetime = new Date();
        // this._companyService.put<Company>(this.company).subscribe(resp => {
        //     this.company = resp;
        //     super.showsuccess(this.company.comp_code + ' update complete');
        //     this._router.navigate(['/masters/company/list']);
        // },
        //     error => {  
        //         super.showError(error);
        //         super.unblockui('#m_form_1');
               
        //     },
        //     () => {
        //         super.unblockui('#m_form_1');
              
        //     });
    }

    navigate_list() {
        this._router.navigate(['/config/route/list/' + this.routetype.name]);
    }

}