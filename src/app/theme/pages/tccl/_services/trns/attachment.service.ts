import { API_ATTACHMENT_UPLOAD } from './../../../../../app-constants';
import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_ATTACHMENT_GET_DEL } from "../../../../../app-constants";
import { Attachment } from '../../_models/trns/attachment';

@Injectable()
export class AttachmentService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public del(id: string) {

        return this.http.delete(API_ATTACHMENT_GET_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }


    public upload(formData: FormData) {
        let headers = new Headers()
        headers.set('Authorization', 'Bearer ' + super.getToken());
        return this.http.post(API_ATTACHMENT_UPLOAD, formData, new RequestOptions({ headers: headers }))
            .map((response: Response) => response.json());
    }
    /*  let formData: FormData = new FormData(); 
         let headers = new Headers()  
             //headers.append('Content-Type', 'json');  
             //headers.append('Accept', 'application/json');  
             let apiUrl1 = "/api/UploadFileApi";  
             this.http.post(apiUrl1, formData, options)  
             .map(res => res.json())  
             .catch(error => Observable.throw(error))  
             .subscribe(  
             data => console.log('success'),  
             error => console.log(error)  
             )   */
}