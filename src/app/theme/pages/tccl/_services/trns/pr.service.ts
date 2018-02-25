import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PAYMENT_GET, API_PAYMENT_LIST } from "../../../../../app-constants";
import { PR } from '../../_models/trns/pr';

@Injectable()
export class PRService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_PAYMENT_LIST, JSON.stringify({ pr_id: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {

        return this.http.get(API_PAYMENT_GET + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    // public put<T>(pr: PR) {

    //     return this.http.put(API_PAYMENT_GET_PUT_DEL + '/' + pr.pr_id, pr, super.jwt())
    //         .map((response: Response) => <T>response.json());
    // }

}