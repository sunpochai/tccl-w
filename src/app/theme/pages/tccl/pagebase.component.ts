import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core/src/metadata/view';

declare var myBundle: any;


export class PageBaseComponent {

    protected currentUser


    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }
    protected showsuccess(msg: string) {
        myBundle.showSuccess(msg);
    }
    protected showError(msg: string) {
        myBundle.showError(msg);
    }
    protected blockui(id: string) {
        myBundle.block(id, {});

    }
    protected unblockui(id: string) {
        myBundle.unblock(id, {});
    }

    protected getADUserLogin() {
        if (this.currentUser && this.currentUser.aduser) {
            return this.currentUser.aduser
        } else {
            return 'TCC\\TestonFrontEnd';
        }

    }
    protected getFullNameUserLogin() {
        if (this.currentUser && this.currentUser.fullname) {
            return this.currentUser.fullname
        }
    }



}