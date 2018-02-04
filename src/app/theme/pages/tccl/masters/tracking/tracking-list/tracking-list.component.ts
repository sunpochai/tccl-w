import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
 

@Component({
    selector: "master-tracking-list",
    templateUrl: "./tracking-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TrackingListComponent implements OnInit, AfterViewInit {


    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('master-tracking-list',
            ['assets/tccl/masters/tracking/tracking-list.js']);

    }

}   