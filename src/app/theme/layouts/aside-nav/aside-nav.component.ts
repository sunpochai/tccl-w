import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {

  isAdmin:boolean;
  isOwner:boolean;
    constructor() {

    }
    ngOnInit() {
        this.isAdmin = true ;
        this.isOwner = true;
    }
    ngAfterViewInit() {

        mLayout.initAside();

    }

}