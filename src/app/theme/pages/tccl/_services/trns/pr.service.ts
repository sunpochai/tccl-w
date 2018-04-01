import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PR_LIST, API_PR_GET, API_PR_GET_PR_ITEM } from "../../../../../app-constants";

@Injectable()
export class PRService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public loaddata() {

        return this.http.post(API_PR_LIST, JSON.stringify({ pr_id: "" }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<T>(id: string) {

        return this.http.get(API_PR_GET + '/' + id, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public getPRItem<T>(pr_no: string, pr_item_no: string) {

        return this.http.post(API_PR_GET_PR_ITEM, JSON.stringify({ pr_no: pr_no, pr_item_no: pr_item_no }), super.jwt())
            .map((response: Response) => <T>response.json());
    }

}