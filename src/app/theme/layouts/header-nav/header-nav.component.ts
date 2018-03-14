import { PageBaseComponent } from './../../pages/tccl/pagebase.component';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent extends PageBaseComponent implements OnInit, AfterViewInit {


    constructor() {
        super();
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }

}