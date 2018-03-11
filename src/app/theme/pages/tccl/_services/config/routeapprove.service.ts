import { TokenBaseService } from './../tokenbase.service';
import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { API_ROUTE_GET, API_ROUTE_LIST } from "../../../../../app-constants";
import { RouteApprove } from '../../_models/config/routeapprove';

@Injectable()
export class RouteApproveService extends TokenBaseService {
    constructor(private http: Http) {
        super();
    }

    //parameter p_doc_group: number
    public loaddata(p_doc_group: number) {
        return this.http.post(API_ROUTE_LIST, JSON.stringify({ doc_group: p_doc_group }), super.jwt())
            .map((response: Response) => response.json());
    }

    public get<Route>(id: string) {
        return this.http.get(API_ROUTE_GET + '/' + id, super.jwt())
            .map((response: Response) => <Route>response.json());
    }

    // public create<T>(company: Company) {
    //     return this.http.post(API_COMPANY_INSERT, company, super.jwt())
    //         .map((response: Response) => <T>response.json());
    // }
    //
    // public put<T>(company: Company) {
    //     return this.http.put(API_COMPANY_PUT + '/' + company.comp_code, company, super.jwt())
    //         .map((response: Response) => <T>response.json());
    // }
    //
    // public del(id: string) {
    //     return this.http.delete(API_COMPANY_DEL + '/' + id, super.jwt())
    //         .map((response: Response) => response.json());
    // }
}