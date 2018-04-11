import { Router } from '@angular/router';
import { PageBaseComponent } from './../../../pagebase.component';

import * as app from './../../../../../../app-constants';
import { ScriptLoaderService } from './../../../../../../_services/script-loader.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { DocTypeService } from './../../../_services/masters/doctype.service';
import { API_DOCTYPE_LIST } from './../../../../../../app-constants';

declare var myDatatable: any;
declare var window: any

@Component({
    selector: "master-doctype-list",
    templateUrl: "./doctype-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DocTypeListComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public action_item: any;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _docTypeService: DocTypeService) {
        super();
    }

    ngOnInit() {
        window.my = window.my || {};
        window.my.namespace = window.my.namespace || {};
        window.my.namespace.del = this.del.bind(this);
        window.my.namespace.navigate_edit = this.navigate_edit.bind(this);
        window.my.namespace.prepare_del = this.prepareDel.bind(this);
    }

    ngAfterViewInit() {
        this._script.loadScripts('master-doctype-list',
            ['assets/tccl/masters/doctype/doctype-list.js']);

        this.load();
    }

    load() {
        super.blockui('#m-content');
        jQuery(document).ready(function() {
            myDatatable.init(API_DOCTYPE_LIST);
        });
        super.unblockui('#m-content');
    }

    add() {
        this._router.navigate(['/masters/doctype/detail/0']);
    }

    prepareDel(p_action_item) {
        this.action_item = p_action_item;
    }

    del() {
        super.blockui('#m-content');

        this._docTypeService.del(this.action_item).subscribe(resp => {
            console.log(resp);
            super.showsuccess(this.action_item + ' delete complete');
            myDatatable.reload();
        },
            error => {
                super.showError(error);
                super.unblockui('#m-content');
                console.log('error');
            },
            () => {
                super.unblockui('#m-content');
                console.log('done');
            });
    }

    navigate_edit(docTypeCode) {
        this._router.navigate(['/masters/doctype/detail/' + docTypeCode]);
    }
}   