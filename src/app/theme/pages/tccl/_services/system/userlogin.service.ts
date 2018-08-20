import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_USERLOGIN_LIST } from "../../../../../app-constants";

@Injectable()
export class OutboundService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    /*     public reupload<T>(in_doc_group: number, in_doc_no: string) {
            return this.http.post(API_OUTBOUND_RE_UPLOAD , JSON.stringify({ doc_group: in_doc_group, doc_no: in_doc_no }), super.jwt())
                .map((response: Response) => <T>response.json());
        }
    
        public manual<T>(in_doc_group: number, in_doc_no: string) {
            return this.http.post(API_OUTBOUND_MANUAL , JSON.stringify({ doc_group: in_doc_group, doc_no: in_doc_no }), super.jwt())
                .map((response: Response) => <T>response.json());
        }
     */
}