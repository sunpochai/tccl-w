import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_REVIEWER_LIST, API_REVIEWER_GET_PUT_DEL, API_REVIEWER_INSERT } from "../../../../../app-constants";
import { Reviewer } from '../../_models/config/reviewer';

@Injectable()
export class ReviewerService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    //parameter p_doc_group: number
    public loaddata(p_doc_group: number) {
        return this.http.post(API_REVIEWER_LIST, super.jwt())
            .map((response: Response) => response.json());
    }

    public get<RouteApprove>(id: string) {
        return this.http.get(API_REVIEWER_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => <RouteApprove>response.json());
    }

    public create<T>(reviewer: Reviewer) {
        return this.http.post(API_REVIEWER_INSERT, reviewer, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public put<T>(reviewer: Reviewer) {
        return this.http.put(API_REVIEWER_GET_PUT_DEL + '/' + reviewer.review_id, reviewer, super.jwt())
            .map((response: Response) => <T>response.json());
    }

    public del(id: string) {
        return this.http.delete(API_REVIEWER_GET_PUT_DEL + '/' + id, super.jwt())
            .map((response: Response) => response.json());
    }
}