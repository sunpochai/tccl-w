
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { PageBaseComponent } from '../../pages/tccl/pagebase.component';

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent extends PageBaseComponent implements OnInit, AfterViewInit {

    isAdmin: boolean;
    isOwner: boolean;
    constructor() {
        super();
    }
    ngOnInit() {
        this.isAdmin = true;
        this.isOwner = true;

        this.isAdmin = this.CheckAdmin();
        this.isOwner = this.CheckOwner();
    }
    ngAfterViewInit() {

        mLayout.initAside();

    }

} 