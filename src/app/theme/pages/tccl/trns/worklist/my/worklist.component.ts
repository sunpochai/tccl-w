import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_WORKLIST, C_DOC_STATUS } from './../../../../../../app-constants';
import { WorklistService } from '../../../_services/trns/worklist.service';
import { Worklist } from '../../../_models/trns/worklist';


declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "trns-worklist",
    templateUrl: "./worklist.component.html",
    styleUrls: ["./worklist.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class WorklistComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public cDocStatus: Array<Array<any>> = C_DOC_STATUS;
    public myworklists: Array<Worklist>;
    public myprs: Array<Worklist>;
    public mypos: Array<Worklist>; 
    public mypas: Array<Worklist>;
    
    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _worklistService: WorklistService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.navigate = this.navigate.bind(this);

        super.blockui('#m_form_1');

        this._worklistService.getall(super.getADUserLogin()).subscribe(data => {
            this.myworklists = data;

            this.myprs = new Array<Worklist>();
            this.mypos = new Array<Worklist>();
            this.mypas = new Array<Worklist>();

            for (let row of this.myworklists) {
                switch (row.name) {
                    case 'PR':
                        this.myprs.push(row);
                        // console.log('pr' + row.name);
                        break;
                    case 'PO':
                        this.mypos.push(row);
                        // console.log('po' + row.name);
                        break;
                    case 'PA':
                        this.mypas.push(row);
                        // console.log('pa' + row.name);
                        break;
                }
            }
            // console.log(this.myworklists);
            // console.log(this.myprs);
            // console.log(this.mypos);
            // console.log(this.mypas);
        });

        super.unblockui('#m_form_1');
    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-worklist',
            ['assets/tccl/trns/worklist/worklist.js']);
    }

    navigate(trnsType, trnsId) {
        switch(trnsType) {
            case 'PR':
                this._router.navigate(['/trns/pr/detail/' + trnsId]);
                break;
            case 'PO':
                //todo:: navigate to PO page;
                break;
            case 'PA':
                //todo:: navigate to PA page;
                break;
            default:
                //todo:: say something to user;
                break;
        }
    }

}   