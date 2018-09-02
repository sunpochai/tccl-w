import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_NON_PO_LIST, API_NON_PO_GET, API_NON_PO_SAVE, API_NON_PO_SEND_APPROVE, API_NON_PO_REASSIGN } from "../../../../../app-constants";
import { NPO } from '../../_models/trns/npo';

@Injectable()
export class NPOService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_NON_PO_LIST, JSON.stringify({ npo_id: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(npo_id: string) {

        return this.http.get(API_NON_PO_GET + '/' + npo_id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public save<T>(in_npo: NPO) {

        return this.http.post(API_NON_PO_SAVE, in_npo, super.jwt())
            .map((response: Response) => response.json());
    }

    public sendApprove<T>(in_npo: NPO) {

        return this.http.post(API_NON_PO_SEND_APPROVE, in_npo, super.jwt())
            .map((response: Response) => response.json());
    }

    public cancel<T>(in_npo: NPO) {

        return this.http.post(API_NON_PO_SEND_APPROVE, in_npo, super.jwt())
            .map((response: Response) => response.json());
    }


}