import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { API_WORKLIST, C_DOC_STATUS_2 } from './../../../../../../app-constants';
import { WorklistService } from '../../../_services/trns/worklist.service';
import { Worklist } from '../../../_models/trns/worklist';
import { DocType } from '../../../_models/masters/doctype';
import { Company } from '../../../_models/masters/company';
import { Plant } from '../../../_models/masters/plant';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { CompanyService } from '../../../_services/masters/company.service';
import { PlantService } from '../../../_services/masters/plant.service';
import { SortPipe } from '../../../../../../_pipe/sort';


declare var myDatatable: any;
declare var window: any;

@Component({
    selector: "trns-worklist",
    templateUrl: "./worklist.component.html",
    styleUrls: ["./worklist.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class WorklistComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public docStatus: Array<any> = C_DOC_STATUS_2;
    public myworklists: Array<Worklist>; /* Use for render in HTML page */
    public totalworklists: Array<Worklist>;
    public doctypeList: Array<DocType>;
    // public companyList: Array<Company>;
    // public plantList: Array<Plant>;
    public showPR: boolean = true;
    public showPO: boolean = true;
    public showPA: boolean = true;
    public showSearch: boolean = false;
    public m_text_search: any;
    public m_list_doctype: any;
    public m_list_company: any;
    public m_list_plant: any;
    public sortBy: string = 'doc_date';
    public sortType: number = 1;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _worklistService: WorklistService,
        private _doctypeService: DocTypeService,
        private _companyService: CompanyService,
        private _plantService: PlantService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.navigate = this.navigate.bind(this);

        super.blockui('#m_form_1');

        this._doctypeService.getall().subscribe(data => {
            this.doctypeList = data;
            // console.log(data);
        });

        // this._companyService.getall().subscribe(data => {
        //     this.companyList = data;
        //     // console.log(data);
        // });

        // this._plantService.getall().subscribe(data => {
        //     this.plantList = data;
        //     // console.log(data);
        // });

        this._worklistService.getall(super.getADUserLogin()).subscribe(data => {
            this.totalworklists = data;
            this.myworklists = data;
            super.unblockui('#m_form_1');
        });

    }

    ngAfterViewInit() {
        this._script.loadScripts('trns-worklist',
            ['assets/tccl/trns/worklist/worklist.js']);
    }

    navigate(trnsType, trnsId) {
        switch (trnsType) {
            case 'PR':
                this._router.navigate(['/trns/pr/detail/' + trnsId]);
                break;
            case 'PO':
                this._router.navigate(['/trns/po/detail/' + trnsId]);
                break;
            case 'PA':
                //todo:: navigate to PA page;
                break;
            default:
                //todo:: say something to user;
                break;
        }
    }

    filter(jobtype: string) {
        switch (jobtype.toLowerCase().toString()) {
            case 'pr':
                this.showPR = true;
                this.showPO = false;
                this.showPA = false;
                break;
            case 'po':
                this.showPR = false;
                this.showPO = true;
                this.showPA = false;
                break;
            case 'pa':
                this.showPR = false;
                this.showPO = false;
                this.showPA = true;
                break;
            default:
                this.showPR = true;
                this.showPO = true;
                this.showPA = true;
                break;
        }

        this.setFilteredItems();
    }

    toggleSearch() {
        this.showSearch = !this.showSearch;
        if (!this.showSearch) {
            this.m_text_search = '';
            this.m_list_doctype = '';
            this.m_list_company = '';
            this.m_list_plant = '';
            this.setFilteredItems();
        }
    }


    setFilteredItems() {
        this.myworklists = this.totalworklists;
        if (this.m_text_search != null && this.m_text_search != '') {
            this.myworklists = this.myworklists.filter(
                (item) => {
                    return (
                        (item.doc_no).toLowerCase().indexOf(this.m_text_search.toLowerCase()) > -1 ||
                        (item.subject).toLowerCase().indexOf(this.m_text_search.toLowerCase()) > -1
                    );
                }
            )
        }

        if (this.m_list_doctype != null && this.m_list_doctype != '') {
            this.myworklists = this.myworklists.filter(
                (item) => {
                    return (
                        item.doc_type.toLowerCase() == this.m_list_doctype.toLowerCase()
                    );
                }
            )
        }

        if (this.m_list_company != null && this.m_list_company != '') {
            this.myworklists = this.myworklists.filter(
                (item) => {
                    return (
                        (item.comp_code).toLowerCase().indexOf(this.m_list_company.toLowerCase()) > -1 ||
                        (item.comp_name).toLowerCase().indexOf(this.m_list_company.toLowerCase()) > -1
                    );
                }
            )
        }

        if (this.m_list_plant != null && this.m_list_plant != '') {
            this.myworklists = this.myworklists.filter(
                (item) => {
                    return (
                        (item.plant_code).toLowerCase().indexOf(this.m_list_plant.toLowerCase()) > -1 ||
                        (item.plant_name).toLowerCase().indexOf(this.m_list_plant.toLowerCase()) > -1
                    );
                }
            )
        }


        this.myworklists = this.myworklists.filter(
            (item) => {
                return (
                    (this.showPR && item.name.toLowerCase() == 'pr') ||
                    (this.showPO && item.name.toLowerCase() == 'po') ||
                    (this.showPA && item.name.toLowerCase() == 'pa')
                );
            }
        )

    }

    sort(pSortBy: string) {
        if (pSortBy == this.sortBy) {
            this.toggleSortType();
        } else {
            this.sortBy = pSortBy;
            this.resetSortType();
        }
    }

    clearSort() {
        this.sortBy = 'doc_date';
        this.resetSortType();
    }

    toggleSortType() {
        this.sortType = this.sortType * -1;
    }

    resetSortType() {
        this.sortType = -1;
    }

    getSortingDisplayClass(pSortBy: string): string {
        if (pSortBy == this.sortBy) {
            if (this.sortType == 1) {
                return 'm-nav__link-icon la la-caret-down';
            } else {
                return 'm-nav__link-icon la la-caret-up';
            }

        } else {
            return 'm-nav__link-icon la la-genderless';
        }
    }

    getSortingDisplayColor(pSortBy: string): string {
        if (pSortBy == this.sortBy) {
            return 'm-nav__link m--font-brand';
        } else {
            return 'm-nav__link';
        }
    }

}   