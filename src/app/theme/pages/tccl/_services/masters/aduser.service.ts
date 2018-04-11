import { API_USER_LIST } from './../../../../../app-constants';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { API_COMPANY_LIST, API_TRACKING_SEARCH } from "../../../../../app-constants";
import { TokenBaseService } from "../tokenbase.service";

@Injectable()
export class ADUserService extends TokenBaseService {

    constructor(private http: Http) {
        super();
    }

    public search(textSearch) {

        return this.http.post(API_USER_LIST, JSON.stringify({ name: textSearch, }), super.jwt())
            .map((response: Response) => response.json());
    }
}