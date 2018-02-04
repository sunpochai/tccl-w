import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../_models/tracking';
 

@Component({
    selector: "master-tracking-detail",
    templateUrl: "./tracking-detail.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TrackingDetailComponent implements OnInit, AfterViewInit {

    private tracking:Tracking ;
   
    
    constructor(private _script: ScriptLoaderService) {
        this.tracking = {id:0,fullName:''};
    }
    ngOnInit() {
            this.tracking.fullName = 'Sanchai Pochai';
           
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-validation-form-controls',
            ['assets/demo/default/custom/components/forms/validation/form-controls.js']);

    }

}