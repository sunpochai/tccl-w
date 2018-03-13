import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core/src/metadata/view';
import { User } from '../../../auth/_models';

declare var myBundle: any;


export class PageBaseComponent {

    protected currentUser : User


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
        return   this.currentUser.fullname;
        
    }
  


}