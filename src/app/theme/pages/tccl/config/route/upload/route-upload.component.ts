import { PageBaseComponent } from './../../../pagebase.component';
import { CompanyService } from './../../../_services/masters/company.service';
import { Helpers } from './../../../../../../helpers';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { Tracking } from '../../../_models/masters/tracking';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../_models/masters/company';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { RouteApproveService } from '../../../_services/config/routeapprove.service';
import { RouteApprove } from '../../../_models/config/routeapprove';
import { ROUTE_PR, ROUTE_PO, ROUTE_PA, API_USER_LIST, API_TRACKING_GET_PUT_DEL, C_DOC_STATUS_REVIEWED, ROUTE_NPO } from '../../../../../../app-constants';
import { DocType } from '../../../_models/masters/doctype';
import { DocTypeService } from '../../../_services/masters/doctype.service';
import { RouteApproveDetail } from '../../../_models/config/routeapprovedetail';
import { forEach } from '@angular/router/src/utils/collection';
import { TrackingService } from '../../../_services/masters/tracking.service';
import { UserService } from '../../../../../../auth/_services';
import { ADUserService } from '../../../_services/masters/aduser.service';
import { Subject } from 'rxjs';
import { SortPipe } from '../../../../../../_pipe/sort';



@Component({
    selector: "route-upload",
    templateUrl: "./route-upload.component.html",
    styleUrls: ["./route-upload.component.css"]

})

export class RouteUploadComponent extends PageBaseComponent implements OnInit, AfterViewInit {
    public formData: FormData = new FormData(); 

    constructor(private _script: ScriptLoaderService,
        private _router: Router, private route: ActivatedRoute,
        private _routeapproveService: RouteApproveService) {
        super();
 
    }


    ngOnInit() {
      //  super.blockui('#m_form_1');
        
    }

    ngAfterViewInit() {
      /*   this._script.loadScripts('config-route-detail',
            ['assets/tccl/config/route/route-detail.js']); */
    }

  async  uploadFile() {
        super.blockui('#m-content');
 
          //  this.formData.append("doc_group", ROUTE_PA.doc_group);
        //    this.formData.append("doc_id", this.pa.payment_id.toString());
            this.formData.append("create_user", this.getADUserLogin());
            this.formData.append("create_username", this.getFullNameUserLogin());

        /*     for (let index = 0; index < this.fileList.length; index++) {
                let file = this.fileList[index];
                this.formData.append("file_" + index.toString(), file, file.name);
            } */
            // console.log(this.attFile);
       let resp  = await   this._routeapproveService.upload(this.formData);
       
       resp.windowToggle
    //    await this._routeapproveService.upload(this.formData).subscribe(
    //         data => {
    //             let att = data;
    //             // console.log(att);  
    //             this.formData = new FormData();
    //             super.unblockui('#m-content');
    //             super.showsuccess('upload complete');
    //         },
    //         error => {
    //             super.unblockui('#m-content');
    //             super.showError(error);
    //         }
    //     );  

        super.unblockui('#m-content');
    }

    }

    /* isTrackingCodeValid(): boolean {
        // console.log(this.routeapprove.tracking_no);
        if (this.routeapprove.tracking_no != null && this.routeapprove.tracking_no != '') {
            return true;
        }

        return false;
    } */


 