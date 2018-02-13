
import {
    Component, OnInit, AfterViewInit, ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../_models/tracking';
import { ActivatedRoute, Router } from '@angular/router';




declare var mApp: any;
declare var myBundle: any;
@Component({
    selector: "master-tracking-detail",
    templateUrl: "./tracking-detail.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TrackingDetailComponent implements OnInit, AfterViewInit {



    constructor(private _script: ScriptLoaderService, private _router: Router) {

    }
    ngOnInit() {



    }
    ngAfterViewInit() {
        this._script.loadScripts('master-tracking-detail',
            ['assets/tccl/masters/tracking/tracking-detail.js']);


    }

    save() {


    }
    save2() {
        myBundle.showSuccess('ssss');
        // mApp.block('#m_form_1', {});


        myBundle.showError('ok');
        // console.log('after ')
        //mApp.unblock('#m_form_1', {});
        this._router.navigate(['/masters/tracking/list']);
    }
}   