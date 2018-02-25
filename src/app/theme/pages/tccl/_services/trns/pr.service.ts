import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_PR_LIST, API_PR_GET } from "../../../../../app-constants";
import { PR } from '../../_models/trns/pr';

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

    public put<T>(pr: PR) {

        return this.http.put(API_PR_GET + '/' + pr.pr_id, pr, super.jwt())
            .map((response: Response) => <T>response.json());
    }

}