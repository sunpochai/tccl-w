import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core/src/metadata/view';
import { User } from '../../../auth/_models';

declare var myBundle: any;


export class PageBaseComponent {

    public currentUser: User


    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }
    protected showsuccess(msg: string) {
        myBundle.showSuccess(msg);
    }
    protected showError(err: any) {
        console.log(err);
        myBundle.showError(err);

    }
    protected blockui(id: string) {
        myBundle.block(id, {});

    }
    protected unblockui(id: string) {
        myBundle.unblock(id, {});
    }

    protected getADUserLogin() {
        if (this.currentUser && this.currentUser.ad_user) {
            return this.currentUser.ad_user
        } else {
            return 'TCC\\SanchaiP';
        }

    }
    protected getFullNameUserLogin() {
        return this.currentUser.fullname;

    }
    protected  CheckAdmin() {
       
        return this.currentUser.roles!=null && 
        this.currentUser.roles.length > 0 &&
        this.currentUser.roles[0] == 'ADMIN';
    }
protected  CheckOwner() {
        return this.currentUser.roles!=null && 
            this.currentUser.roles.length > 0 &&
            this.currentUser.roles[0] == 'OWNER';
 
    }


}