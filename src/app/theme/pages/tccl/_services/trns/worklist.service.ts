import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_WORKLIST } from "../../../../../app-constants";

@Injectable()
export class WorklistService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public getall(in_user) {

        return this.http.post(API_WORKLIST, JSON.stringify({ user: in_user }), super.jwt())
            .map((response: Response) => response.json());
    }

}